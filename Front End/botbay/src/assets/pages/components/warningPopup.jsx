import React from "react";
import { createPortal } from "react-dom"; // Import this
import Blocker from "./blocker";
import "../../styles/status.css";

function WarningPopup({ message, complete, close }) {
    const content = (
        <>
            <div className="s-popup" style={{ zIndex: 10006 }}>
                <p id="s-popup-warning-title">Warning</p>
                <p>{message}</p>
                <p>Are you sure you want to continue?</p>
                <div className="leftcontainer">
                    <div className="halfcontainer">
                        <button id="s-popup-warning-button-no" onClick={close}>
                            No
                        </button>
                    </div>
                    <div className="halfcontainer">
                        <button
                            id="s-popup-warning-button-yes"
                            onClick={complete}
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
            <Blocker id="global-blocker" style={{ zIndex: 10005 }} />
        </>
    );

    return createPortal(content, document.body);
}

export default WarningPopup;
