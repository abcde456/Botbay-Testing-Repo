import React, { useState, useEffect } from "react";
import {
    IoTrashSharp,
    IoFlash,
    IoBatteryDead,
    IoCheckmarkCircle,
} from "react-icons/io5";

function BatteryList({ table, onUpdate, onDelete }) {
    const [pendingBattery, setPendingBattery] = useState(null);
    const [exactValue, setExactValue] = useState(50);
    const [, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setTick((t) => t + 1), 10000);
        return () => clearInterval(interval);
    }, []);

    const handleConfirm = (name, startLevel) => {
        onUpdate(name, true, startLevel);
        setPendingBattery(null);
        setExactValue(50);
    };

    const calculatePercent = (item) => {
        if (!item.mcStatus || !item.startTime) return item.startLevel || 0;
        const elapsedHours =
            (Date.now() - new Date(item.startTime).getTime()) /
            (1000 * 60 * 60);
        const addedCharge = elapsedHours * (item.chargerSpeed || 2);
        const addedPercent = (addedCharge / (item.capacity || 12)) * 100;
        return Math.min(Math.floor((item.startLevel || 0) + addedPercent), 100);
    };

    const getStatusColor = (item, level) => {
        if (!item.mcStatus) return "#64748b";
        if (level >= 90) return "#3b82f6";
        if (level >= 75) return "#10b981";
        if (level <= 20) return "rgb(239, 68, 68)";
        return "#f97316";
    };

    return (
        <div className="d-battery-listitem">
            <style>{`
                @keyframes battery-sync-glow {
                    0%, 100% {
                        box-shadow: 0 0 2px var(--glow-active-color);
                        opacity: var(--glow-opacity-min);
                    }
                    50% {
                        box-shadow: 0 0 1.125rem 4px var(--glow-active-color);
                        opacity: var(--glow-opacity-max);
                    }
                }

                .status-col-cell {
                    width: 40px;
                    padding-left: 15px;
                    vertical-align: middle;
                }

                .indicator-light {
                    width: 1.125rem;
                    height: 1.125rem;
                    border-radius: 50%;
                    display: block;
                    aspect-ratio: 1 / 1;
                    animation: battery-sync-glow 2s infinite ease-in-out;
                }

                /* Mobile/Phone Card UI */
                .phone-card-container {
                    display: none;
                    flex-direction: column;
                    gap: 20px;
                    width: 100%;
                }

                @media (max-width: 1199px) {
                    table { display: none; }
                    .phone-card-container { display: flex; }

                    .battery-card {
                        background: rgba(255, 255, 255, 0.03);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 20px;
                        padding: 30px;
                        width: 95%;
                        margin: 0 auto;
                        box-sizing: border-box;
                        font-size: 4rem !important;
                    }

                    .card-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 15px;
                    }

                    .battery-card strong { color: #fff; font-size: 4rem; }
                    .battery-card span, .battery-card div { font-size: 4rem; }

                    .battery-card svg, .indicator-light {
                        width: 4rem !important;
                        height: 4rem !important;
                        font-size: 4rem !important;
                    }

                    .d-slider-box input[type="range"] {
                        width: 100% !important;
                        height: 30px !important;
                        background: #334155;
                        border-radius: 15px;
                    }

                    .d-slider-box input[type="range"]::-webkit-slider-thumb {
                        width: 50px !important;
                        height: 50px !important;
                    }

                    /* Action Buttons matching desktop colors */
                    .d-battery-pocbutton, .d-battery-tocbutton {
                        font-size: 4rem !important;
                        border-radius: 15px !important;
                    }

                    .d-selector-container {
                        width: 100%;
                        flex-direction: column;
                        padding: 20px;
                        gap: 25px;
                    }

                    .phone-d-battery-notice-text{
                        font-size: 3rem
                    }
                }
            `}</style>

            <p
                className="phone-d-battery-notice-text"
                style={{ color: "#94a3b8", marginBottom: "20px" }}
            >
                This battery charge tracker is to only be used as a reference,
                it is NOT 100% accurate
            </p>

            {/* DESKTOP TABLE - UNCHANGED */}
            <table>
                <thead>
                    <tr>
                        <th className="status-col-cell"></th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Current Session</th>
                        <th>Status</th>
                        <th>Manage</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {table &&
                        table.map((item) => {
                            const currentLevel = calculatePercent(item);
                            const statusColor = getStatusColor(
                                item,
                                currentLevel,
                            );
                            return (
                                <tr key={item.name}>
                                    <td className="status-col-cell">
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span
                                                className="indicator-light"
                                                style={{
                                                    backgroundColor:
                                                        statusColor,
                                                    "--glow-active-color":
                                                        item.mcStatus
                                                            ? statusColor
                                                            : "transparent",
                                                    "--glow-opacity-min":
                                                        item.mcStatus
                                                            ? "0.4"
                                                            : "1",
                                                    "--glow-opacity-max": "1",
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: "600" }}>
                                        {item.name}
                                    </td>
                                    <td>
                                        {item.type === "dh"
                                            ? "Driver Hub"
                                            : "Battery"}
                                    </td>
                                    <td>
                                        {item.mcStatus
                                            ? formatDuration(item.toc)
                                            : "--:--"}
                                    </td>
                                    <td>
                                        <div className="d-status-container">
                                            {item.mcStatus ? (
                                                <div className="d-battery-charging-text">
                                                    <IoFlash /> Charging{" "}
                                                    {currentLevel}%
                                                </div>
                                            ) : (
                                                <div className="d-battery-idle-text">
                                                    <IoBatteryDead /> Idle
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-manage-wrapper">
                                            {pendingBattery === item.name ? (
                                                <div className="d-selector-container">
                                                    {item.type === "dh" ? (
                                                        <div className="d-slider-box">
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                value={
                                                                    exactValue
                                                                }
                                                                onChange={(e) =>
                                                                    setExactValue(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                value={
                                                                    exactValue
                                                                }
                                                                onKeyDown={(
                                                                    e,
                                                                ) => {
                                                                    if (
                                                                        e.key ===
                                                                        "Enter"
                                                                    )
                                                                        e.target.blur();
                                                                }}
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    let val =
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        );
                                                                    if (
                                                                        isNaN(
                                                                            val,
                                                                        )
                                                                    )
                                                                        val = 0;
                                                                    if (
                                                                        val >
                                                                        100
                                                                    )
                                                                        val = 100;
                                                                    if (val < 0)
                                                                        val = 0;
                                                                    setExactValue(
                                                                        val,
                                                                    );
                                                                }}
                                                                onFocus={(
                                                                    e,
                                                                ) => {
                                                                    e.target.style.borderColor =
                                                                        "#8b5cf6";
                                                                    e.target.style.backgroundColor =
                                                                        "rgba(30, 32, 48, 0.8)";
                                                                    e.target.style.boxShadow =
                                                                        "0 0 0 3px rgba(139, 92, 246, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.3)";
                                                                }}
                                                                onBlur={(e) => {
                                                                    e.target.style.borderColor =
                                                                        "rgba(255, 255, 255, 0.1)";
                                                                    e.target.style.backgroundColor =
                                                                        "rgba(15, 17, 26, 0.6)";
                                                                    e.target.style.boxShadow =
                                                                        "inset 0 2px 4px rgba(0, 0, 0, 0.3)";
                                                                }}
                                                                style={{
                                                                    width: "75px",
                                                                    height: "40px",
                                                                    padding:
                                                                        "0 8px",
                                                                    color: "#ffffff",
                                                                    fontSize:
                                                                        "1.1rem",
                                                                    fontWeight:
                                                                        "700",
                                                                    fontFamily:
                                                                        "'JetBrains Mono', 'Consolas', monospace",
                                                                    textAlign:
                                                                        "center",
                                                                    backgroundColor:
                                                                        "rgba(15, 17, 26, 0.6)",
                                                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                                                    borderRadius:
                                                                        "8px",
                                                                    boxShadow:
                                                                        "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
                                                                    outline:
                                                                        "none",
                                                                    transition:
                                                                        "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                                                    appearance:
                                                                        "none",
                                                                    WebkitAppearance:
                                                                        "none",
                                                                    margin: "0",
                                                                }}
                                                            />
                                                            <IoCheckmarkCircle
                                                                className="d-confirm-icon"
                                                                onClick={() =>
                                                                    handleConfirm(
                                                                        item.name,
                                                                        exactValue,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="d-preset-box">
                                                            {[
                                                                0, 25, 50, 75,
                                                            ].map((lvl) => (
                                                                <button
                                                                    key={lvl}
                                                                    onClick={() =>
                                                                        handleConfirm(
                                                                            item.name,
                                                                            lvl,
                                                                        )
                                                                    }
                                                                >
                                                                    {lvl}%
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <button
                                                        className="d-cancel-x"
                                                        onClick={() =>
                                                            setPendingBattery(
                                                                null,
                                                            )
                                                        }
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="d-action-buttons">
                                                    <button
                                                        className="d-battery-pocbutton"
                                                        disabled={item.mcStatus}
                                                        onClick={() => {
                                                            setPendingBattery(
                                                                item.name,
                                                            );
                                                            setExactValue(0);
                                                        }}
                                                    >
                                                        Put on Charger
                                                    </button>
                                                    <button
                                                        className="d-battery-tocbutton"
                                                        disabled={
                                                            !item.mcStatus
                                                        }
                                                        onClick={() =>
                                                            onUpdate(
                                                                item.name,
                                                                false,
                                                                0,
                                                            )
                                                        }
                                                    >
                                                        Take off
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-trash-wrapper">
                                            <IoTrashSharp
                                                className="d-battery-trash"
                                                onClick={() =>
                                                    onDelete(item.name)
                                                }
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>

            {/* PHONE CARD VIEW - MATCHED STYLE */}
            <div className="phone-card-container">
                {table &&
                    table.map((item) => {
                        const currentLevel = calculatePercent(item);
                        const statusColor = getStatusColor(item, currentLevel);
                        return (
                            <div key={item.name} className="battery-card">
                                <div className="card-row">
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "20px",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span
                                            className="indicator-light"
                                            style={{
                                                backgroundColor: statusColor,
                                                "--glow-active-color":
                                                    item.mcStatus
                                                        ? statusColor
                                                        : "transparent",
                                                "--glow-opacity-min":
                                                    item.mcStatus ? "0.4" : "1",
                                                "--glow-opacity-max": "1",
                                            }}
                                        />
                                        <strong>{item.name}</strong>
                                    </div>
                                    <IoTrashSharp
                                        className="d-battery-trash"
                                        onClick={() => onDelete(item.name)}
                                    />
                                </div>

                                <div
                                    className="card-row"
                                    style={{ color: "#94a3b8" }}
                                >
                                    <span>
                                        {item.type === "dh"
                                            ? "Driver Hub"
                                            : "Battery"}
                                    </span>
                                    <span>
                                        {item.mcStatus
                                            ? formatDuration(item.toc)
                                            : "--:--"}
                                    </span>
                                </div>

                                <div className="card-row">
                                    {item.mcStatus ? (
                                        <div className="d-battery-charging-text">
                                            <IoFlash /> {currentLevel}%
                                        </div>
                                    ) : (
                                        <div className="d-battery-idle-text">
                                            Idle
                                        </div>
                                    )}
                                </div>

                                <div
                                    className="d-manage-wrapper"
                                    style={{ marginTop: "20px" }}
                                >
                                    {pendingBattery === item.name ? (
                                        <div className="d-selector-container">
                                            {item.type === "dh" ? (
                                                <div
                                                    className="d-slider-box"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 0",
                                                    }}
                                                >
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={exactValue}
                                                        onChange={(e) =>
                                                            setExactValue(
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        style={{
                                                            width: "100%",
                                                            height: "30px", // bigger touch target
                                                            marginBottom:
                                                                "10px",
                                                        }}
                                                    />
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={exactValue}
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                    "Enter"
                                                                )
                                                                    e.target.blur();
                                                            }}
                                                            onChange={(e) => {
                                                                let val =
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                if (isNaN(val))
                                                                    val = 0;
                                                                if (val > 100)
                                                                    val = 100;
                                                                if (val < 0)
                                                                    val = 0;
                                                                setExactValue(
                                                                    val,
                                                                );
                                                            }}
                                                            style={{
                                                                width: "70px",
                                                                height: "40px",
                                                                fontSize:
                                                                    "3rem",
                                                                fontWeight:
                                                                    "700",
                                                                fontFamily:
                                                                    "'JetBrains Mono', monospace",
                                                                textAlign:
                                                                    "center",
                                                                backgroundColor:
                                                                    "rgba(15, 17, 26, 0.6)",
                                                                color: "#f8fafc",
                                                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                                                borderRadius:
                                                                    "8px",
                                                                outline: "none",
                                                                boxShadow:
                                                                    "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
                                                                transition:
                                                                    "border-color 0.2s ease, box-shadow 0.2s ease",
                                                                appearance:
                                                                    "none",
                                                                WebkitAppearance:
                                                                    "none",
                                                                margin: "0",
                                                            }}
                                                            onFocus={(e) => {
                                                                e.target.style.borderColor =
                                                                    "#8b5cf6";
                                                                e.target.style.boxShadow =
                                                                    "0 0 0 3px rgba(139, 92, 246, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.3)";
                                                            }}
                                                            onBlur={(e) => {
                                                                e.target.style.borderColor =
                                                                    "rgba(255, 255, 255, 0.1)";
                                                                e.target.style.boxShadow =
                                                                    "inset 0 2px 4px rgba(0, 0, 0, 0.3)";
                                                            }}
                                                        />
                                                        <IoCheckmarkCircle
                                                            className="d-confirm-icon"
                                                            style={{
                                                                color: "#47d5a6",
                                                                fontSize:
                                                                    "28px",
                                                            }}
                                                            onClick={() =>
                                                                handleConfirm(
                                                                    item.name,
                                                                    exactValue,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="d-preset-box"
                                                    style={{
                                                        flexWrap: "wrap",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    {[0, 25, 50, 75].map(
                                                        (lvl) => (
                                                            <button
                                                                key={lvl}
                                                                onClick={() =>
                                                                    handleConfirm(
                                                                        item.name,
                                                                        lvl,
                                                                    )
                                                                }
                                                            >
                                                                {lvl}%
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                            <button
                                                onClick={() =>
                                                    setPendingBattery(null)
                                                }
                                                style={{
                                                    background: "transparent",
                                                    color: "#64748b",
                                                    border: "none",
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className="d-action-buttons"
                                            style={{
                                                display: "flex",
                                                gap: "15px",
                                                width: "100%",
                                            }}
                                        >
                                            <button
                                                className="d-battery-pocbutton"
                                                style={{ flex: 1 }}
                                                disabled={item.mcStatus}
                                                onClick={() => {
                                                    setPendingBattery(
                                                        item.name,
                                                    );
                                                    setExactValue(0);
                                                }}
                                            >
                                                Charge
                                            </button>
                                            <button
                                                className="d-battery-tocbutton"
                                                style={{ flex: 1 }}
                                                disabled={!item.mcStatus}
                                                onClick={() =>
                                                    onUpdate(
                                                        item.name,
                                                        false,
                                                        0,
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default BatteryList;

function formatDuration(toc) {
    if (!toc) return "0:00";
    const diffInMs = Date.now() - toc;
    const totalMinutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
}
