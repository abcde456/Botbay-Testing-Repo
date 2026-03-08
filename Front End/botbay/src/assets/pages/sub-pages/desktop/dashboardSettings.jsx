import React, { useState, useEffect } from "react";
import {
    updateAccount,
    groupAction,
    verifyCurrentPassword,
    fetchGroupData,
    deleteUserAccount,
} from "../../../scripts/auth.js";
import {
    MdOutlineEmail,
    MdLockOutline,
    MdExitToApp,
    MdDeleteForever,
    MdLock,
} from "react-icons/md";

import "../../../styles/dashboard.css";
import Blocker from "../../components/blocker";

function SettingsPageDesktop() {
    const [isPhone, setIsPhone] = useState(window.innerWidth < 1200);
    const [isVerified, setIsVerified] = useState(false);
    const [verifyPass, setVerifyPass] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Group state fetched after verification
    const [groupState, setGroupState] = useState({
        groupId: null,
        isAdmin: false,
    });

    useEffect(() => {
        const handleResize = () => setIsPhone(window.innerWidth < 1200);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 1. New consolidated state for all popups/alerts
    const [popup, setPopup] = useState({
        show: false,
        type: "info", // 'info' for alerts, 'confirm' for actions
        message: "",
        onConfirm: null,
    });

    // Helper to close popup
    const closePopup = () => setPopup({ ...popup, show: false });

    // 2. Updated handleVerify
    const handleVerify = async () => {
        if (!verifyPass) return;
        setLoading(true);
        try {
            await verifyCurrentPassword(verifyPass);
            const res = await fetchGroupData();
            if (res.success) {
                setGroupState({ groupId: res.groupId, isAdmin: res.isAdmin });
                setIsVerified(true);
            } else {
                setPopup({
                    show: true,
                    type: "info",
                    message: "Failed to load group data: " + res.error,
                });
            }
        } catch (e) {
            setPopup({ show: true, type: "info", message: e.message });
        } finally {
            setLoading(false);
        }
    };

    // 3. Updated Account Actions
    const handleUpdateEmail = async () => {
        if (!email) return;
        try {
            await updateAccount({ email });
            setPopup({
                show: true,
                type: "info",
                message: "Confirmation email sent to both addresses.",
            });
        } catch (e) {
            setPopup({ show: true, type: "info", message: e.message });
        }
    };

    const handleUpdatePassword = async () => {
        if (!password) return;
        try {
            await updateAccount({ password });
            setPopup({
                show: true,
                type: "info",
                message: "Password updated!",
            });
        } catch (e) {
            setPopup({ show: true, type: "info", message: e.message });
        }
    };

    // 4. Updated handleGroupAction (The Confirmation Popup)
    const handleGroupAction = (action) => {
        const message =
            action === "delete"
                ? "PERMANENTLY DELETE entire group? This cannot be undone."
                : "Leave this group?";

        setPopup({
            show: true,
            type: "confirm",
            message: message,
            onConfirm: async () => {
                try {
                    await groupAction(groupState.groupId, action);
                    window.location.hash = "#/";
                } catch (e) {
                    setPopup({ show: true, type: "info", message: e.message });
                }
            },
        });
    };

    const handleDeleteAccountRequest = () => {
        setPopup({
            show: true,
            type: "confirm",
            message: "DELETE ACCOUNT? This is permanent and cannot be undone.",
            onConfirm: () => {
                deleteUserAccount();
            },
        });
    };
    // --- Identity Verification Screen (Phone Aware) ---
    if (!isVerified) {
        return (
            <>
                {popup.show && (
                    <Popup
                        isPhone={isPhone}
                        popup={popup}
                        setPopup={setPopup}
                    />
                )}
                <div
                    className="d-settings-wrapper"
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "60vh",
                    }}
                >
                    <div
                        className="d-settings-section"
                        style={{
                            width: "100%",
                            maxWidth: isPhone ? "95%" : "500px",
                            textAlign: "center",
                            border: "1px solid #44327a",
                        }}
                    >
                        <MdLock
                            size={isPhone ? "10rem" : "3.5rem"}
                            color="#44327a"
                            style={{ marginBottom: "20px" }}
                        />
                        <h2
                            style={{
                                fontSize: isPhone ? "6rem" : "2.2rem",
                                marginBottom: "15px",
                            }}
                        >
                            Confirm Identity
                        </h2>
                        <p
                            style={{
                                fontSize: isPhone ? "3rem" : "1.1rem",
                                color: "#94a3b8",
                                marginBottom: "30px",
                            }}
                        >
                            Enter your current password to unlock sensitive
                            settings.
                        </p>
                        <input
                            className="d-settings-input"
                            type="password"
                            placeholder="Current Password"
                            value={verifyPass}
                            onChange={(e) => setVerifyPass(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleVerify()
                            }
                        />
                        <button
                            className="d-settings-btn-primary"
                            onClick={handleVerify}
                            style={{ marginTop: isPhone ? "40px" : "20px" }}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Unlock Settings"}
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // --- Main Settings UI ---
    return (
        <>
            {popup.show && (
                <Popup isPhone={isPhone} popup={popup} setPopup={setPopup} />
            )}
            <div className="d-settings-wrapper">
                <h2
                    style={{
                        fontSize: isPhone ? "6rem" : "2.5rem",
                        marginBottom: isPhone ? "40px" : "20px",
                        color: "#fff",
                    }}
                >
                    Account & Group
                </h2>

                {/* Email Section */}
                <div className="d-settings-section">
                    <label className="d-settings-label">
                        <MdOutlineEmail /> Update Email
                    </label>
                    <input
                        className="d-settings-input"
                        type="email"
                        placeholder="New Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        className="d-settings-btn-primary"
                        onClick={handleUpdateEmail}
                    >
                        Update Email
                    </button>
                </div>

                {/* Password Section */}
                <div className="d-settings-section">
                    <label className="d-settings-label">
                        <MdLockOutline /> Update Password
                    </label>
                    <input
                        className="d-settings-input"
                        type="password"
                        placeholder="New Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="d-settings-btn-primary"
                        onClick={handleUpdatePassword}
                    >
                        Update Password
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="d-settings-danger-zone">
                    <label
                        className="d-settings-label"
                        style={{ color: "#ff4d4d" }}
                    >
                        Danger Zone
                    </label>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: isPhone ? "30px" : "15px",
                            marginTop: "20px",
                        }}
                    >
                        <button
                            className="d-settings-btn-danger"
                            onClick={() => handleGroupAction("leave")}
                        >
                            <MdExitToApp /> Leave Group
                        </button>

                        <hr style={{ color: "red", width: "100%" }}></hr>

                        {groupState.isAdmin && (
                            <button
                                className="d-settings-btn-danger"
                                style={{
                                    backgroundColor: "rgba(255, 77, 77, 0.1)",
                                }}
                                onClick={() => handleGroupAction("delete")}
                            >
                                <MdDeleteForever /> Delete Group
                            </button>
                        )}

                        <button
                            className="d-settings-btn-danger"
                            style={{
                                borderStyle: "dashed",
                                marginTop: isPhone ? "30px" : "10px",
                            }}
                            onClick={handleDeleteAccountRequest}
                        >
                            <MdDeleteForever /> Delete My Account
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SettingsPageDesktop;

function Popup({ isPhone, popup, setPopup }) {
    return (
        <div
            className="d-createtagoverlay"
            style={{
                padding: isPhone ? "40px" : "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Blocker />
            {/* Exit Button */}
            <button
                className="d-partoverlay-exitbutton"
                onClick={() => setPopup({ ...popup, show: false })}
                style={{ fontSize: isPhone ? "5rem" : "2rem" }}
            >
                X
            </button>

            <h2
                style={{
                    fontSize: isPhone ? "4.5rem" : "2.5rem",
                    color: "white",
                    textAlign: "center",
                    marginBottom: "20px",
                }}
            >
                {popup.type === "confirm" ? "Confirm Action" : "Notice"}
            </h2>

            <p
                style={{
                    fontSize: isPhone ? "3.5rem" : "1.2rem",
                    color: "#ccc",
                    textAlign: "center",
                    width: "90%",
                    marginBottom: "30px",
                }}
            >
                {popup.message}
            </p>

            {/* Action Buttons */}
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {popup.type === "confirm" ? (
                    <>
                        <button
                            className="signupbutton"
                            onClick={() => {
                                popup.onConfirm();
                                setPopup({ ...popup, show: false });
                            }}
                            style={{
                                width: "90%",
                                height: isPhone ? "10rem" : "60px",
                                fontSize: isPhone ? "3.5rem" : "1.2rem",
                                backgroundColor: "#ff4444", // Danger color for confirm
                            }}
                        >
                            Confirm
                        </button>
                        <button
                            className="signupbutton"
                            onClick={() => setPopup({ ...popup, show: false })}
                            style={{
                                width: "90%",
                                height: isPhone ? "10rem" : "60px",
                                fontSize: isPhone ? "3.5rem" : "1.2rem",
                                marginTop: "20px",
                                backgroundColor: "#444",
                            }}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        className="signupbutton"
                        onClick={() => setPopup({ ...popup, show: false })}
                        style={{
                            width: "90%",
                            height: isPhone ? "10rem" : "60px",
                            fontSize: isPhone ? "3.5rem" : "1.2rem",
                        }}
                    >
                        OK
                    </button>
                )}
            </div>
        </div>
    );
}
