import { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { supabase } from "./assets/scripts/auth.js";
import LandingPage from "./assets/pages/landingpage.jsx";
import SignUpPage from "./assets/pages/signuppage.jsx";
import SignInPage from "./assets/pages/signinpage.jsx";
import ForgotPasswordPage from "./assets/pages/forgotpasswordpage.jsx";
import Dashboard from "./assets/pages/dashboard.jsx";
import UpdatePasswordPage from "./assets/pages/updatepassword.jsx";

function App() {
    (function () {
        // 1. Identification
        const tabActive = sessionStorage.getItem("tab_session_active");
        const perfEntries = performance.getEntriesByType("navigation");
        const isReload =
            perfEntries.length > 0 && perfEntries[0].type === "reload";

        // 2. THE FIX: Check BOTH storage engines for the auth token
        const findAuthToken = () => {
            const sKey = Object.keys(sessionStorage).find((k) =>
                k.includes("-auth-token"),
            );
            const lKey = Object.keys(localStorage).find((k) =>
                k.includes("-auth-token"),
            );

            // Return an object with the key and storage type so we can delete it if needed
            if (sKey) return { key: sKey, storage: sessionStorage };
            if (lKey) return { key: lKey, storage: localStorage };
            return null;
        };

        const authSession = findAuthToken();
        const isUserLoggedIn = !!authSession;

        // 3. Authenticated Zone
        if (isUserLoggedIn) {
            if (!tabActive || isReload) {
                console.log(
                    isReload ? "Auth Reload" : "New Auth Session",
                    " - Clearing secure data...",
                );

                // Wipe inventory data
                localStorage.removeItem("partData");
                localStorage.removeItem("taglist");
                localStorage.removeItem("batteryList");

                if (isReload) {
                    // Remove the specific token from whichever storage it was in
                    authSession.storage.removeItem(authSession.key);

                    // Nuclear clear for the session (only affects this tab)
                    sessionStorage.clear();
                    window.location.hash = "#/";
                }
            }
        }

        // 4. Mark tab as active
        sessionStorage.setItem("tab_session_active", "true");
    })();

    useEffect(() => {
        const handleTabClose = () => {
            // Use the same dual-check logic here for consistency
            const sKey = Object.keys(sessionStorage).find((k) =>
                k.includes("-auth-token"),
            );
            const lKey = Object.keys(localStorage).find((k) =>
                k.includes("-auth-token"),
            );
            const isUserLoggedIn = sKey || lKey;

            if (isUserLoggedIn) {
                localStorage.removeItem("partData");
                localStorage.removeItem("taglist");
                localStorage.removeItem("batteryList");
            }
        };

        window.addEventListener("beforeunload", handleTabClose);
        return () => window.removeEventListener("beforeunload", handleTabClose);
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route
                        path="/forgotpassword"
                        element={<ForgotPasswordPage />}
                    />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                        path="/updatepassword"
                        element={<UpdatePasswordPage />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
