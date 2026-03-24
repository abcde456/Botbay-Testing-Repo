import React from "react";
import "../styles/landingpage.css";
import "../styles/sharedstyles.css";

function PrivacyPolicy() {
    return (
        <div className="privacycontainer">
            <h1 className="herotitle">Privacy Policy</h1>

            <p className="abouttext">
                <span className="abouttext-bold">
                    Your privacy is important to us.
                </span>{" "}
                This Privacy Policy explains how our application collects, uses,
                and protects your information.
            </p>

            <h2 className="abouttext">
                <span className="abouttext-bold">Information We Collect</span>
            </h2>
            <p className="abouttext">
                Your <span className="abouttext-bold">email address</span> is
                collected when you sign up for an account and is used to
                authenticate your account and communicate with you. We may also
                collect{" "}
                <span className="abouttext-bold">
                    non-personally identifiable information
                </span>{" "}
                such as app usage statistics. We do not use cookies or track
                activity outside the app.
            </p>

            <h2 className="abouttext">
                <span className="abouttext-bold">
                    How We Use Your Information
                </span>
            </h2>
            <p className="abouttext">
                To manage your account, provide and improve app functionality.
            </p>

            <h2 className="abouttext">
                <span className="abouttext-bold">
                    Data Storage and Deletion
                </span>
            </h2>
            <p className="abouttext">
                All information is securely stored using Supabase. If you delete
                your account, all personal data, including email and non-PII
                data, will be permanently removed.
            </p>

            <h2 className="abouttext">
                <span className="abouttext-bold">Sharing Your Information</span>
            </h2>
            <p className="abouttext">
                We do not sell, trade, or share your personal information with
                third parties. Data is used only for your dashboard.
            </p>

            <h2 className="abouttext">
                <span className="abouttext-bold">Security</span>
            </h2>
            <p className="abouttext">
                We implement technical measures to protect your information from
                unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="abouttext">
                <span className="abouttext-bold">Contact Us</span>
            </h2>
            <p className="abouttext">
                If you have any questions, please contact us at{" "}
                <span className="abouttext-bold">
                    botbay_contact@outlook.com
                </span>
                .
            </p>
        </div>
    );
}

export default PrivacyPolicy;
