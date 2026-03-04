import { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./assets/pages/landingpage.jsx";
import SignUpPage from "./assets/pages/signuppage.jsx";
import SignInPage from "./assets/pages/signinpage.jsx";
import ForgotPasswordPage from "./assets/pages/forgotpasswordpage.jsx";
import Dashboard from "./assets/pages/dashboard.jsx";

function App() {
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
                </Routes>
            </div>
        </Router>
    );
}

export default App;
