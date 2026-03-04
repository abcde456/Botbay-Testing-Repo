import React from "react";
import ReactDOM from "react-dom";

function Blocker({ style = {} }) {
    return ReactDOM.createPortal(
        <div
            style={{
                background: "rgba(10, 10, 10, 0.35)",
                width: "100vw",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 10000,
                ...style,
            }}
        />,
        document.body,
    );
}

export default Blocker;
