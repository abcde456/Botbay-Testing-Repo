import React, { useState } from "react";

function StatusPopup() {
    return (
        <div
            style={{
                background: "rgba(10, 10, 10, 0.35)",
                width: "100vw",
                height: "100vh",
                position: "fixed",
                zIndex: "10001",
            }}
        ></div>
    );
}

export default StatusPopup;
