import React, { useState, useEffect } from "react";
import signUpLogo from "../images/LogoTrans.png";
import { sendPasswordResetEmail } from "../scripts/auth.js";

import "../styles/signupstyles.css";
import "../styles/sharedstyles.css";

function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [notice, setNotice] = useState({ message: "", color: "transparent" });
    const [loading, setLoading] = useState(false);

    // --- PHONE CHECK LOGIC ---
    const [isPhone, setIsPhone] = useState(window.innerWidth <= 1199);

    useEffect(() => {
        const handleResize = () => setIsPhone(window.innerWidth <= 1199);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleResetAction = async () => {
        if (!email) {
            setNotice({ message: "Please enter your email.", color: "red" });
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(email);
            setNotice({
                message: "Reset link sent! Check your inbox.",
                color: "green",
            });
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
                        <p className="signupheader">Botbay</p>
                    </div>
                    <div className="inputcontainer">
                        <p className="inputheader">Email:</p>
                        <input
                            className="signupinput"
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <div className="bottomcontainer">
                            <p className="bottomtext">
                                Input your email for a reset link.
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
                                onClick={handleResetAction}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Reset Password"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
