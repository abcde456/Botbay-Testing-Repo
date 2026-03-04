import React, { useState } from "react";
import BatteryList from "../../components/battery";

function BatteryPageDesktop() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState("b");
    const [newCapacity, setNewCapacity] = useState("3.0");
    const [newSpeed, setNewSpeed] = useState("2.0");

    // 1. New state to track if the name already exists
    const [isDuplicate, setIsDuplicate] = useState(false);

    const [savedBatteries, setSavedBatteries] = useState(() => {
        const localData = localStorage.getItem("batteryList");
        return localData ? JSON.parse(localData) : [];
    });

    // 2. Updated change handler to check for duplicates in real-time
    const handleNameChange = (e) => {
        const value = e.target.value;
        setNewName(value);

        // Check if name exists (case-insensitive)
        const exists = savedBatteries.some(
            (b) => b.name.toLowerCase() === value.trim().toLowerCase(),
        );
        setIsDuplicate(exists);
    };

    const addBattery = (e) => {
        e.preventDefault();

        // 3. Final safety check: block submission if duplicate or empty
        if (!newName.trim() || isDuplicate) return;

        const newBattery = {
            name: newName.trim(),
            type: newType,
            capacity: parseFloat(newCapacity) || 3.0,
            chargerSpeed: parseFloat(newSpeed) || 2.0,
            toc: Date.now(),
            startTime: null,
            startLevel: 0,
            mcStatus: false,
        };

        const updatedList = [...savedBatteries, newBattery];
        setSavedBatteries(updatedList);
        localStorage.setItem("batteryList", JSON.stringify(updatedList));

        // Reset fields
        setNewName("");
        setNewCapacity("3.0");
        setNewSpeed("2.0");
        setIsDuplicate(false); // Reset duplicate state
        setIsPopupOpen(false);
    };

    // ... (deleteBattery and updateBatteryStatus remain the same)

    const deleteBattery = (nameToDelete) => {
        const updatedList = savedBatteries.filter(
            (battery) => battery.name !== nameToDelete,
        );
        setSavedBatteries(updatedList);
        localStorage.setItem("batteryList", JSON.stringify(updatedList));
    };

    const updateBatteryStatus = (name, isCharging, startLevel = 0) => {
        const updatedList = savedBatteries.map((item) => {
            if (item.name === name) {
                return {
                    ...item,
                    mcStatus: isCharging,
                    startLevel: startLevel,
                    startTime: isCharging ? Date.now() : null,
                    toc: Date.now(),
                };
            }
            return item;
        });

        setSavedBatteries(updatedList);
        localStorage.setItem("batteryList", JSON.stringify(updatedList));
    };

    function handlePopUpOpen() {
        setIsPopupOpen(true);
    }

    function handlePopUpClose() {
        setIsPopupOpen(false);
        setIsDuplicate(false); // Reset on close
        setNewName("");
    }

    const hasBatteries = savedBatteries && savedBatteries.length > 0;

    return (
        <div className="d-homepagecontainer">
            <div className="d-battery-centercontainer">
                <div className="d-battery-titlecontainer">
                    <p>Batteries</p>
                    <button
                        className="d-battery-add-trigger"
                        onClick={handlePopUpOpen}
                    >
                        + Add New Battery
                    </button>
                </div>
                {hasBatteries ? (
                    <BatteryList
                        table={savedBatteries}
                        onUpdate={updateBatteryStatus}
                        onDelete={deleteBattery}
                    />
                ) : (
                    <div className="centercontainer">
                        <p style={{ color: "white" }}>
                            You are not tracking any batteries...
                        </p>
                    </div>
                )}

                {isPopupOpen && (
                    <div className="d-battery-popup-overlay">
                        <div className="d-battery-popup">
                            <h3>Track New Battery</h3>
                            <form onSubmit={addBattery}>
                                <label
                                    style={{
                                        color: "#94a3b8",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Battery Name (e.g. Unit 1)"
                                    value={newName}
                                    onChange={handleNameChange}
                                    required
                                    // 4. Conditional styling for the red border
                                    style={{
                                        border: isDuplicate
                                            ? "2px solid #ef4444"
                                            : "1px solid #ccc",
                                        outline: "none",
                                    }}
                                />
                                {/* 5. Optional: Error message */}
                                {isDuplicate && (
                                    <p
                                        style={{
                                            color: "#ef4444",
                                            fontSize: "0.7rem",
                                            marginTop: "-10px",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        This name is already in use.
                                    </p>
                                )}

                                <label
                                    style={{
                                        color: "#94a3b8",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    Device Type
                                </label>
                                <select
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value)}
                                >
                                    <option value="b">Standard Battery</option>
                                    <option value="dh">Driver Hub</option>
                                </select>

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <div style={{ flex: 1 }}>
                                        <label
                                            style={{
                                                color: "#94a3b8",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            Capacity (Ah)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={newCapacity}
                                            onChange={(e) =>
                                                setNewCapacity(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label
                                            style={{
                                                color: "#94a3b8",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            Charger (A)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={newSpeed}
                                            onChange={(e) =>
                                                setNewSpeed(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="d-battery-popup-buttons">
                                    <button
                                        type="submit"
                                        className="d-battery-pocbutton"
                                        disabled={isDuplicate} // 6. Disable button if duplicate
                                        style={{
                                            opacity: isDuplicate ? 0.5 : 1,
                                        }}
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handlePopUpClose}
                                        style={{
                                            backgroundColor: "#334155",
                                            color: "white",
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BatteryPageDesktop;
