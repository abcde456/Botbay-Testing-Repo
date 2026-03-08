import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { updatePassword } from "../scripts/auth.js";
import signUpLogo from "../images/LogoTrans.png";

import "../styles/signupstyles.css";
import "../styles/sharedstyles.css";

function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Toggle state
    const [notice, setNotice] = useState({ message: "", color: "transparent" });
    const [loading, setLoading] = useState(false);

    // --- PHONE CHECK LOGIC ---
    const [isPhone, setIsPhone] = useState(window.innerWidth <= 1199);

    useEffect(() => {
        const handleResize = () => setIsPhone(window.innerWidth <= 1199);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleUpdateAction = async () => {
        if (password.length < 6) {
            setNotice({
                message: "Password must be at least 6 characters.",
                color: "red",
            });
            return;
        }

        setLoading(true);
        try {
            await updatePassword(password);
            setNotice({
                message: "Success! Redirecting to login...",
                color: "green",
            });
            setTimeout(() => {
                window.location.hash = "#/signin";
            }, 2000);
        } catch (err) {
            setNotice({ message: err.message, color: "red" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="screencontainer">
            <div className="centercontainer-signup">
                <div className="contentcontainer">
                    <div className="logocontainer">
                        <img
                            className="signuplogo"
                            src={signUpLogo}
                            alt="Logo"
                        />
                        <p className="signupheader">New Password</p>
                    </div>
                    <div className="inputcontainer">
                        <p className="inputheader">Enter New Password:</p>

                        <div style={{ position: "relative", width: "100%" }}>
                            <input
                                className="signupinput"
                                type={showPassword ? "text" : "password"}
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: "100%" }}
                            />
                            <div
                                className="eye-icon"
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: "absolute",
                                    right: isPhone ? "40px" : "15px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {showPassword ? (
                                    <EyeOff
                                        size={isPhone ? 24 : 24}
                                        color="black"
                                    />
                                ) : (
                                    <Eye
                                        size={isPhone ? 24 : 24}
                                        color="black"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="bottomcontainer">
                            <p className="bottomtext">
                                Choose a strong password to secure your account.
                            </p>
                            <p
                                id="noticetext"
                                style={{
                                    color: notice.color,
                                    fontSize: notice.message
                                        ? isPhone
                                            ? "4rem"
                                            : "1rem"
                                        : "0rem",
                                    transition: "0.3s ease",
                                    marginTop: isPhone ? "20px" : "10px",
                                    textAlign: "center",
                                }}
                            >
                                {notice.message || "Hello"}
                            </p>
                        </div>
                        <div className="bottomcontainer">
                            <button
                                className="signupbutton"
                                onClick={handleUpdateAction}
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdatePasswordPage;
