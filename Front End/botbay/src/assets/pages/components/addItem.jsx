import React, { useState, useEffect } from "react";
import { isUserSignedIn, getUserGroup } from "../../scripts/auth";
import { cloudCreatePart } from "../../scripts/database";

function useIsPhone() {
    const [isPhone, setIsPhone] = useState(window.innerWidth < 1200);

    useEffect(() => {
        const handleResize = () => setIsPhone(window.innerWidth < 1200);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isPhone;
}

export function AddItemMenuDesktop({ onClose }) {
    const [partIndexOpen, setPartIndexOpen] = useState(null);
    function handleReturn() {
        setPartIndexOpen(null);
    }
    // Part type indexes:
    // null -> not open
    // 0 -> Motor
    // 1 -> Servo
    // 2 -> Structural
    // 3 -> Electrical
    // 4 -> Sensor
    // 5 -> 3D Printed
    // 6 -> Machined
    // 7 -> Other
    // 8 -> Wheel
    function renderCorrectItemToAdd() {
        switch (partIndexOpen) {
            case 0:
                return <AddMotor onReturn={handleReturn} onClose={onClose} />;
            case 1:
                return <AddServo onReturn={handleReturn} onClose={onClose} />;
            case 2:
                return (
                    <AddStructural onReturn={handleReturn} onClose={onClose} />
                );
            case 3:
                return (
                    <AddElectrical onReturn={handleReturn} onClose={onClose} />
                );
            case 4:
                return <AddSensor onReturn={handleReturn} onClose={onClose} />;
            case 5:
                return (
                    <Add3dPrinted onReturn={handleReturn} onClose={onClose} />
                );
            case 6:
                return (
                    <AddMachined onReturn={handleReturn} onClose={onClose} />
                );
            case 7:
                return <AddOther onReturn={handleReturn} onClose={onClose} />;
        }
    }

    return (
        <>
            <div className="d-partoverlay">
                <button className="d-partoverlay-exitbutton" onClick={onClose}>
                    X
                </button>
                <div className={`d-titlecontainer d-titlecontainer-centered`}>
                    <p>Add Item</p>
                </div>
                {partIndexOpen === null && (
                    <div className="d-createitem-centercontainer">
                        <div className="d-createitem-middlecontainer">
                            <button onClick={() => setPartIndexOpen(0)}>
                                Motor
                            </button>
                            <button onClick={() => setPartIndexOpen(1)}>
                                Servo
                            </button>
                            <button onClick={() => setPartIndexOpen(2)}>
                                Structural
                            </button>
                            <button onClick={() => setPartIndexOpen(3)}>
                                Electrical
                            </button>
                            <button onClick={() => setPartIndexOpen(4)}>
                                Sensor
                            </button>
                            <button onClick={() => setPartIndexOpen(5)}>
                                3D Printed
                            </button>
                            <button onClick={() => setPartIndexOpen(6)}>
                                Machined
                            </button>
                            <button onClick={() => setPartIndexOpen(7)}>
                                Other
                            </button>
                        </div>
                    </div>
                )}
                {partIndexOpen !== null && renderCorrectItemToAdd()}
            </div>
        </>
    );
}

export function AddItemMenuPhone() {}

function AddMotor({ onReturn, onClose }) {
    const isPhone = useIsPhone();
    const getContrastYIQ = (hexcolor) => {
        if (!hexcolor) return "black";

        // Remove hash
        let cleanHex = hexcolor.replace("#", "");

        // Convert 3-digit hex (#fff) to 6-digit (#ffffff)
        if (cleanHex.length === 3) {
            cleanHex = cleanHex
                .split("")
                .map((char) => char + char)
                .join("");
        }

        // If it's not a valid 6-digit hex now, just return black
        if (cleanHex.length !== 6) return "black";

        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);

        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        return yiq >= 128 ? "black" : "white";
    };
    const [formData, setFormData] = useState({
        manufacturerId: "",
        name: "",
        tags: [],
        manufacturer: "",
        type: "motor",
        connectorTypes: "",
        maxPower: "",
        stallCurrent: "",
        voltage: "",
        outputShaftLength: "",
        noLoadSpeed: "",
        cpr: "",
        ppr: "",
        stallTorque: "",
        shaftType: "",
        iconLink: "",
        cadLink: "",
        storeLink: "",
    });

    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("taglist") || "[]");
        setAvailableTags(stored);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleTag = (tagName) => {
        setFormData((prev) => {
            const isSelected = prev.tags.includes(tagName);
            const newTags = isSelected
                ? prev.tags.filter((t) => t !== tagName)
                : [...prev.tags, tagName];
            return { ...prev, tags: newTags };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMotor = {
            editable: true,
            manufacturerId: formData.manufacturerId,

            name: formData.name,
            manufacturer: formData.manufacturer || "",
            tags: formData.tags,
            stats: {
                type: "motor",
                connector_types: formData.connectorTypes
                    ? formData.connectorTypes.split(",").map((s) => s.trim())
                    : [],
                max_power: Number(formData.maxPower) || null,
                stall_current: Number(formData.stallCurrent) || null,
                voltage: Number(formData.voltage) || null,
                output_shaft_length: Number(formData.outputShaftLength) || null,
                no_load_speed: Number(formData.noLoadSpeed) || null,
                cpr: Number(formData.cpr) || null,
                ppr: Number(formData.ppr) || null,
                stall_torque: Number(formData.stallTorque) || null,
                shaft_type: formData.shaftType || "",
            },
            quantity: 0,
            needed: 0,
            icon: formData.iconLink,
            links: {
                CAD: formData.cadLink,
                Store: formData.storeLink,
            },
        };

        createNewItem(newMotor);
        onClose();
    };

    return (
        <>
            <button className="d-partoverlay-returnbutton" onClick={onReturn}>
                &lt;
            </button>

            <div className="d-createitem-centercontainer">
                <form onSubmit={handleSubmit} className="d-createitem-form">
                    <h3 className="d-createitem-form-subtitle">
                        Motor Specifications
                    </h3>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Basic Info:</h4>

                    <div className="d-createitem-input-group">
                        <label>Name:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="name"
                                placeholder="e.g. NeveRest Orbital 20"
                                value={formData.name}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.name?.length || 0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.name?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - formData.name.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer ID:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturerId"
                                placeholder="e.g. am-3637b"
                                value={formData.manufacturerId}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturerId?.length ||
                                            0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturerId?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - formData.manufacturerId.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturer"
                                placeholder="e.g. am-3637b"
                                value={formData.manufacturer}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturer?.length || 0) >=
                                        25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturer?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - formData.manufacturer.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Tags (Select all that apply):</label>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginTop: "10px",
                            }}
                        >
                            {availableTags.map((tag) => {
                                const isSelected = formData.tags.includes(
                                    tag.name,
                                );

                                const bgColor = isSelected
                                    ? tag.color || "#ccc"
                                    : "#333";

                                const textColor = isSelected
                                    ? getContrastYIQ(bgColor)
                                    : "#888";

                                return (
                                    <div
                                        key={tag.name}
                                        onClick={() => toggleTag(tag.name)}
                                        style={{
                                            cursor: "pointer",
                                            padding: "6px 12px",
                                            borderRadius: "15px",
                                            fontSize: isPhone
                                                ? "2.5rem"
                                                : "0.75rem",
                                            fontWeight: "bold",
                                            textTransform: "capitalize",
                                            transition: "all 0.2s",
                                            backgroundColor: isSelected
                                                ? tag.color
                                                : "#333",
                                            color: textColor,
                                            border: `1px solid ${isSelected ? tag.color : "#444"}`,
                                        }}
                                    >
                                        {tag.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Stats:</h4>

                    <div className="d-createitem-input-group">
                        <label>Connector Types (Comma Separated):</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="connectorTypes"
                                placeholder="JST-VH-2, Anderson Powerpoles"
                                value={formData.connectorTypes}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.connectorTypes?.length ||
                                            0) >= 140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.connectorTypes?.length || 0) >= 140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 - formData.connectorTypes.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Max Power (V):</label>
                        <input
                            type="number"
                            name="maxPower"
                            max={99999}
                            value={formData.maxPower}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Stall Current (A):</label>
                        <input
                            type="number"
                            name="stallCurrent"
                            max={99999}
                            value={formData.stallCurrent}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Voltage (V):</label>
                        <input
                            type="number"
                            name="voltage"
                            max={99999}
                            value={formData.voltage}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Output Shaft Length (mm):</label>
                        <input
                            type="number"
                            name="outputShaftLength"
                            max={99999}
                            value={formData.outputShaftLength}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>No-Load Speed (RPM):</label>
                        <input
                            type="number"
                            name="noLoadSpeed"
                            max={99999}
                            value={formData.noLoadSpeed}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Counts per Revolution:</label>
                        <input
                            type="number"
                            name="cpr"
                            max={99999}
                            value={formData.cpr}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Pulses per Revolution:</label>
                        <input
                            type="number"
                            name="ppr"
                            max={99999}
                            value={formData.ppr}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Stall Torque (Nm):</label>
                        <input
                            type="number"
                            name="stallTorque"
                            max={99999}
                            value={formData.stallTorque}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Shaft Type:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="shaftType"
                                value={formData.shaftType}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.shaftType?.length || 0) >= 140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.shaftType?.length || 0) >= 140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 - formData.shaftType.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Links:</h4>

                    <div className="d-createitem-input-group">
                        <label>Image Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="iconLink"
                                value={formData.iconLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.iconLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.iconLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - formData.iconLink.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>CAD Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="cadLink"
                                value={formData.cadLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.cadLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.cadLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - formData.cadLink.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Store Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="storeLink"
                                value={formData.storeLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.storeLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.storeLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - formData.storeLink.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="d-createitem-submit-button"
                    >
                        Create Motor
                    </button>
                </form>
            </div>
        </>
    );
}

function AddServo({ onReturn, onClose }) {
    const isPhone = useIsPhone();
    const getContrastYIQ = (hexcolor) => {
        if (!hexcolor) return "black";

        // Remove hash
        let cleanHex = hexcolor.replace("#", "");

        // Convert 3-digit hex (#fff) to 6-digit (#ffffff)
        if (cleanHex.length === 3) {
            cleanHex = cleanHex
                .split("")
                .map((char) => char + char)
                .join("");
        }

        // If it's not a valid 6-digit hex now, just return black
        if (cleanHex.length !== 6) return "black";

        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);

        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        return yiq >= 128 ? "black" : "white";
    };

    const [formData, setFormData] = useState({
        manufacturerId: "",
        name: "",
        tags: [],
        manufacturer: "",
        type: "servo",
        // Stats fields
        sizeL: "",
        sizeW: "",
        sizeH: "",
        weight: "",
        speed: "",
        angularRange: "",
        gearMaterial: "",
        splineType: "",
        splineThreadType: "",
        splineInternalDepth: "",
        stallCurrent: "",
        stallTorque: "",
        // Links
        iconLink: "",
        cadLink: "",
        storeLink: "",
    });

    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("taglist") || "[]");
        setAvailableTags(stored);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleTag = (tagName) => {
        setFormData((prev) => {
            const isSelected = prev.tags.includes(tagName);
            const newTags = isSelected
                ? prev.tags.filter((t) => t !== tagName)
                : [...prev.tags, tagName];
            return { ...prev, tags: newTags };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newServo = {
            editable: true,
            manufacturerId: formData.manufacturerId,

            name: formData.name,
            manufacturer: formData.manufacturer || "unknown",
            tags: formData.tags,
            stats: {
                type: "servo",
                size: [
                    Number(formData.sizeL) || 0,
                    Number(formData.sizeW) || 0,
                    Number(formData.sizeH) || 0,
                ],
                weight: Number(formData.weight) || null,
                speed: Number(formData.speed) || null,
                angular_range: Number(formData.angularRange) || null,
                gear_material: formData.gearMaterial || "",
                spline_type: formData.splineType || "",
                spline_thread_type: formData.splineThreadType || "",
                spline_internal_depth:
                    Number(formData.splineInternalDepth) || null,
                stall_current: Number(formData.stallCurrent) || null,
                stall_torque: Number(formData.stallTorque) || null,
            },
            quantity: 0,
            needed: 0,
            icon: formData.iconLink,
            links: {
                CAD: formData.cadLink,
                Store: formData.storeLink,
            },
        };

        createNewItem(newServo);
        onClose();
    };

    return (
        <>
            <button className="d-partoverlay-returnbutton" onClick={onReturn}>
                &lt;
            </button>

            <div className="d-createitem-centercontainer">
                <form onSubmit={handleSubmit} className="d-createitem-form">
                    <h3 className="d-createitem-form-subtitle">
                        Servo Specifications
                    </h3>
                    <hr className="d-createitem-form-divider"></hr>

                    <h4 className="d-createitem-form-subtitle2">Basic Info:</h4>
                    <div className="d-createitem-input-group">
                        <label>Name:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="name"
                                placeholder="e.g. Smart Robot Servo"
                                value={formData.name}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.name?.length || 0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.name?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - formData.name.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer ID:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturerId"
                                placeholder="e.g. REV-41-1097"
                                value={formData.manufacturerId}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturerId?.length ||
                                            0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturerId?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - formData.manufacturerId.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturer"
                                placeholder="e.g. rev"
                                value={formData.manufacturer}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturer?.length || 0) >=
                                        25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturer?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - formData.manufacturer.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Tags (Select all that apply):</label>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginTop: "10px",
                            }}
                        >
                            {availableTags.map((tag) => {
                                const isSelected = formData.tags.includes(
                                    tag.name,
                                );
                                const bgColor = isSelected
                                    ? tag.color || "#ccc"
                                    : "#333";
                                const textColor = isSelected
                                    ? getContrastYIQ(bgColor)
                                    : "#888";
                                return (
                                    <div
                                        key={tag.name}
                                        onClick={() => toggleTag(tag.name)}
                                        style={{
                                            cursor: "pointer",
                                            padding: "6px 12px",
                                            borderRadius: "15px",
                                            fontSize: isPhone
                                                ? "2.5rem"
                                                : "0.75rem",
                                            fontWeight: "bold",
                                            textTransform: "capitalize",
                                            transition: "all 0.2s",
                                            backgroundColor: bgColor,
                                            color: textColor,
                                            border: `1px solid ${isSelected ? tag.color : "#444"}`,
                                        }}
                                    >
                                        {tag.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Stats:</h4>

                    <div className="d-createitem-input-group">
                        <label>Size (L, W, H mm):</label>
                        <div style={{ display: "flex", gap: "5px" }}>
                            <input
                                type="number"
                                step="0.1"
                                max={99999}
                                name="sizeL"
                                placeholder="L"
                                value={formData.sizeL}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                step="0.1"
                                max={99999}
                                name="sizeW"
                                placeholder="W"
                                value={formData.sizeW}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                step="0.1"
                                max={99999}
                                name="sizeH"
                                placeholder="H"
                                value={formData.sizeH}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Weight (g):</label>
                        <input
                            type="number"
                            step="0.01"
                            max={99999}
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Speed (sec/60°):</label>
                        <input
                            type="number"
                            step="0.01"
                            max={99999}
                            name="speed"
                            value={formData.speed}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Angular Range (°):</label>
                        <input
                            type="number"
                            max={99999}
                            name="angularRange"
                            value={formData.angularRange}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Gear Material:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="gearMaterial"
                                placeholder="e.g. metal"
                                value={formData.gearMaterial}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.gearMaterial?.length || 0) >=
                                        140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.gearMaterial?.length || 0) >= 140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 - formData.gearMaterial.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Spline Type:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="splineType"
                                placeholder="e.g. 25T"
                                value={formData.splineType}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.splineType?.length || 0) >=
                                        140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.splineType?.length || 0) >= 140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 - formData.splineType.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Spline Thread Type:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="splineThreadType"
                                placeholder="e.g. M3"
                                value={formData.splineThreadType}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.splineThreadType?.length ||
                                            0) >= 140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.splineThreadType?.length || 0) >=
                                140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 - formData.splineThreadType.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Spline Internal Depth (mm):</label>
                        <input
                            type="number"
                            max={99999}
                            name="splineInternalDepth"
                            value={formData.splineInternalDepth}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Stall Current (A):</label>
                        <input
                            type="number"
                            step="0.1"
                            max={99999}
                            name="stallCurrent"
                            value={formData.stallCurrent}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Stall Torque (Nm):</label>
                        <input
                            type="number"
                            step="0.01"
                            max={99999}
                            name="stallTorque"
                            value={formData.stallTorque}
                            onChange={handleChange}
                        />
                    </div>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Links:</h4>

                    <div className="d-createitem-input-group">
                        <label>Icon URL:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="iconLink"
                                value={formData.iconLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.iconLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.iconLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - formData.iconLink.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>CAD Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="cadLink"
                                value={formData.cadLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.cadLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.cadLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - formData.cadLink.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Store Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="storeLink"
                                value={formData.storeLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.storeLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.storeLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - formData.storeLink.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="d-createitem-submit-button"
                    >
                        Create Servo
                    </button>
                </form>
            </div>
        </>
    );
}

function AddStructural({ onReturn, onClose }) {
    const isPhone = useIsPhone();
    const getContrastYIQ = (hexcolor) => {
        if (!hexcolor) return "black";

        // Remove hash
        let cleanHex = hexcolor.replace("#", "");

        // Convert 3-digit hex (#fff) to 6-digit (#ffffff)
        if (cleanHex.length === 3) {
            cleanHex = cleanHex
                .split("")
                .map((char) => char + char)
                .join("");
        }

        // If it's not a valid 6-digit hex now, just return black
        if (cleanHex.length !== 6) return "black";

        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);

        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        return yiq >= 128 ? "black" : "white";
    };

    const [formData, setFormData] = useState({
        manufacturerId: "",
        name: "",
        tags: [],
        manufacturer: "",
        type: "structural",
        // Stats fields
        sizeL: "",
        sizeW: "",
        sizeH: "",
        // Links
        iconLink: "",
        cadLink: "",
        storeLink: "",
    });

    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("taglist") || "[]");
        setAvailableTags(stored);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleTag = (tagName) => {
        setFormData((prev) => {
            const isSelected = prev.tags.includes(tagName);
            const newTags = isSelected
                ? prev.tags.filter((t) => t !== tagName)
                : [...prev.tags, tagName];
            return { ...prev, tags: newTags };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newStructural = {
            editable: true,
            manufacturerId: formData.manufacturerId,

            name: formData.name,
            manufacturer: formData.manufacturer || "unknown",
            tags: formData.tags,
            stats: {
                type: "structural",
                size: [
                    Number(formData.sizeL) || 0,
                    Number(formData.sizeW) || 0,
                    Number(formData.sizeH) || 0,
                ],
            },
            quantity: 0,
            needed: 0,
            icon: formData.iconLink,
            links: {
                CAD: formData.cadLink,
                Store: formData.storeLink,
            },
        };

        createNewItem(newStructural);
        onClose();
    };

    return (
        <>
            <button className="d-partoverlay-returnbutton" onClick={onReturn}>
                &lt;
            </button>
            <div className="d-createitem-centercontainer">
                <form onSubmit={handleSubmit} className="d-createitem-form">
                    <h3 className="d-createitem-form-subtitle">
                        Structural Specifications
                    </h3>
                    <hr className="d-createitem-form-divider"></hr>

                    <h4 className="d-createitem-form-subtitle2">Basic Info:</h4>
                    <div className="d-createitem-input-group">
                        <label>Name:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="name"
                                placeholder="e.g. 45mm U Channel"
                                value={formData.name}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.name?.length || 0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.name?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - formData.name.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer ID:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturerId"
                                placeholder="e.g. REV-41-1755"
                                value={formData.manufacturerId}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturerId?.length ||
                                            0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturerId?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - formData.manufacturerId.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturer"
                                placeholder="e.g. rev"
                                value={formData.manufacturer}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturer?.length || 0) >=
                                        25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturer?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - formData.manufacturer.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Tags (Select all that apply):</label>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginTop: "10px",
                            }}
                        >
                            {availableTags.map((tag) => {
                                const isSelected = formData.tags.includes(
                                    tag.name,
                                );
                                const bgColor = isSelected
                                    ? tag.color || "#ccc"
                                    : "#333";
                                const textColor = isSelected
                                    ? getContrastYIQ(bgColor)
                                    : "#888";
                                return (
                                    <div
                                        key={tag.name}
                                        onClick={() => toggleTag(tag.name)}
                                        style={{
                                            cursor: "pointer",
                                            padding: "6px 12px",
                                            borderRadius: "15px",
                                            fontSize: isPhone
                                                ? "2.5rem"
                                                : "0.75rem",
                                            fontWeight: "bold",
                                            textTransform: "capitalize",
                                            backgroundColor: bgColor,
                                            color: textColor,
                                            border: `1px solid ${isSelected ? tag.color : "#444"}`,
                                        }}
                                    >
                                        {tag.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Stats:</h4>

                    <div className="d-createitem-input-group">
                        <label>Length (mm):</label>
                        <input
                            type="number"
                            step="0.1"
                            max={99999}
                            name="sizeL"
                            value={formData.sizeL}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Width (mm):</label>
                        <input
                            type="number"
                            step="0.1"
                            max={99999}
                            name="sizeW"
                            value={formData.sizeW}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Height (mm):</label>
                        <input
                            type="number"
                            step="0.1"
                            max={99999}
                            name="sizeH"
                            value={formData.sizeH}
                            onChange={handleChange}
                        />
                    </div>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Links:</h4>

                    <div className="d-createitem-input-group">
                        <label>Icon URL:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="iconLink"
                                value={formData.iconLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.iconLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.iconLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - formData.iconLink.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>CAD Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="cadLink"
                                value={formData.cadLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.cadLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.cadLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - formData.cadLink.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Store Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="storeLink"
                                value={formData.storeLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.storeLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.storeLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - formData.storeLink.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="d-createitem-submit-button"
                    >
                        Create Structural
                    </button>
                </form>
            </div>
        </>
    );
}

function AddElectrical({ onReturn, onClose }) {
    const isPhone = useIsPhone();
    const getContrastYIQ = (hexcolor) => {
        if (!hexcolor) return "black";

        // Remove hash
        let cleanHex = hexcolor.replace("#", "");

        // Convert 3-digit hex (#fff) to 6-digit (#ffffff)
        if (cleanHex.length === 3) {
            cleanHex = cleanHex
                .split("")
                .map((char) => char + char)
                .join("");
        }

        // If it's not a valid 6-digit hex now, just return black
        if (cleanHex.length !== 6) return "black";

        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);

        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        return yiq >= 128 ? "black" : "white";
    };

    const [formData, setFormData] = useState({
        manufacturerId: "",
        name: "",
        tags: [],
        manufacturer: "",
        type: "electrical",
        // Stats fields
        capacity: "",
        voltage: "",
        weight: "",
        wireGauge: "",
        sizeL: "",
        sizeW: "",
        sizeH: "",
        connectorTypes: "", // Will be comma-separated
        replaceableFuse: "",
        maxDischarge: "",
        wireLength: "",
        chargeRates: "",
        // Links
        iconLink: "",
        cadLink: "",
        storeLink: "",
    });

    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("taglist") || "[]");
        setAvailableTags(stored);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleTag = (tagName) => {
        setFormData((prev) => {
            const isSelected = prev.tags.includes(tagName);
            const newTags = isSelected
                ? prev.tags.filter((t) => t !== tagName)
                : [...prev.tags, tagName];
            return { ...prev, tags: newTags };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newElectrical = {
            editable: true,
            manufacturerId: formData.manufacturerId,

            name: formData.name,
            manufacturer: formData.manufacturer || "unknown",
            tags: formData.tags,
            stats: {
                type: "electrical",
                capacity: Number(formData.capacity) || null,
                voltage: Number(formData.voltage) || null,
                weight: Number(formData.weight) || null,
                wire_gauge: Number(formData.wireGauge) || null,
                size: [
                    Number(formData.sizeL) || null,
                    Number(formData.sizeW) || null,
                    Number(formData.sizeH) || null,
                ],
                connector_types: formData.connectorTypes
                    ? formData.connectorTypes.split(",").map((s) => s.trim())
                    : [],
                replaceable_fuse: formData.replaceableFuse || null,
                max_discharge: Number(formData.maxDischarge) || null,
                wire_length: Number(formData.wireLength) || null,
                charge_rates: formData.chargeRates || null,
            },
            quantity: 0,
            needed: 0,
            icon: formData.iconLink,
            links: {
                CAD: formData.cadLink,
                Store: formData.storeLink,
            },
        };

        createNewItem(newElectrical);
        onClose();
    };

    return (
        <>
            <button className="d-partoverlay-returnbutton" onClick={onReturn}>
                &lt;
            </button>
            <div className="d-createitem-centercontainer">
                <form onSubmit={handleSubmit} className="d-createitem-form">
                    <h3 className="d-createitem-form-subtitle">
                        Electrical Specifications
                    </h3>
                    <hr className="d-createitem-form-divider"></hr>

                    <h4 className="d-createitem-form-subtitle2">Basic Info:</h4>
                    <div className="d-createitem-input-group">
                        <label>Name:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="name"
                                placeholder="e.g. Tamiya Male to PowerPole"
                                value={formData.name}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.name?.length || 0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.name?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - formData.name.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer ID:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturerId"
                                placeholder="e.g. 70191"
                                value={formData.manufacturerId}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturerId?.length ||
                                            0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturerId?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - formData.manufacturerId.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturer"
                                placeholder="e.g. studica"
                                value={formData.manufacturer}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturer?.length || 0) >=
                                        25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturer?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - formData.manufacturer.length}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="d-createitem-input-group">
                        <label>Tags (Select all that apply):</label>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginTop: "10px",
                            }}
                        >
                            {availableTags.map((tag) => {
                                const isSelected = formData.tags.includes(
                                    tag.name,
                                );
                                const bgColor = isSelected
                                    ? tag.color || "#ccc"
                                    : "#333";
                                return (
                                    <div
                                        key={tag.name}
                                        onClick={() => toggleTag(tag.name)}
                                        style={{
                                            cursor: "pointer",
                                            padding: "6px 12px",
                                            borderRadius: "15px",
                                            fontSize: isPhone
                                                ? "2.5rem"
                                                : "0.75rem",
                                            fontWeight: "bold",
                                            backgroundColor: bgColor,
                                            color: isSelected
                                                ? getContrastYIQ(bgColor)
                                                : "#888",
                                            border: `1px solid ${isSelected ? tag.color : "#444"}`,
                                        }}
                                    >
                                        {tag.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Stats:</h4>

                    <div className="d-createitem-input-group">
                        <label>Connector Types (Comma separated):</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="connectorTypes"
                                placeholder="Tamiya, Anderson Powerpoles"
                                value={formData.connectorTypes}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.connectorTypes?.length ||
                                            0) >= 140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.connectorTypes?.length || 0) >= 140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 - formData.connectorTypes.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Voltage (V):</label>
                        <input
                            type="number"
                            step="0.1"
                            max={99999}
                            name="voltage"
                            value={formData.voltage}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Capacity (mAh):</label>
                        <input
                            type="number"
                            max={99999}
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Wire Gauge (AWG):</label>
                        <input
                            type="number"
                            max={99999}
                            name="wireGauge"
                            value={formData.wireGauge}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Wire Length (mm):</label>
                        <input
                            type="number"
                            max={99999}
                            name="wireLength"
                            value={formData.wireLength}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Max Discharge (A):</label>
                        <input
                            type="number"
                            max={99999}
                            name="maxDischarge"
                            value={formData.maxDischarge}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Replaceable Fuse:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="replaceableFuse"
                                placeholder="e.g. 20A Mini Blade"
                                value={formData.replaceableFuse}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.replaceableFuse?.length ||
                                            0) >= 140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.replaceableFuse?.length || 0) >= 140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 - formData.replaceableFuse.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Charge Rates:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="chargeRates"
                                placeholder="e.g. 2C"
                                value={formData.chargeRates}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.chargeRates?.length || 0) >=
                                        140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.chargeRates?.length || 0) >= 140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 - formData.chargeRates.length}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Weight (g):</label>
                        <input
                            type="number"
                            step="0.1"
                            max={99999}
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Size (L, W, H mm):</label>
                        <div style={{ display: "flex", gap: "5px" }}>
                            <input
                                type="number"
                                max={99999}
                                name="sizeL"
                                placeholder="L"
                                value={formData.sizeL}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                max={99999}
                                name="sizeW"
                                placeholder="W"
                                value={formData.sizeW}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                max={99999}
                                name="sizeH"
                                placeholder="H"
                                value={formData.sizeH}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Links:</h4>
                    <div className="d-createitem-input-group">
                        <label>Icon URL:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="iconLink"
                                value={formData.iconLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.iconLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.iconLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.iconLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>CAD Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="cadLink"
                                value={formData.cadLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.cadLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.cadLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.cadLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Store Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="storeLink"
                                value={formData.storeLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.storeLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.storeLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.storeLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="d-createitem-submit-button"
                    >
                        Create Electrical Part
                    </button>
                </form>
            </div>
        </>
    );
}

function AddSensor({ onReturn, onClose }) {
    const isPhone = useIsPhone();
    const getContrastYIQ = (hexcolor) => {
        if (!hexcolor) return "black";

        // Remove hash
        let cleanHex = hexcolor.replace("#", "");

        // Convert 3-digit hex (#fff) to 6-digit (#ffffff)
        if (cleanHex.length === 3) {
            cleanHex = cleanHex
                .split("")
                .map((char) => char + char)
                .join("");
        }

        // If it's not a valid 6-digit hex now, just return black
        if (cleanHex.length !== 6) return "black";

        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);

        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        return yiq >= 128 ? "black" : "white";
    };

    const [formData, setFormData] = useState({
        manufacturerId: "",
        name: "",
        tags: [],
        manufacturer: "",
        type: "sensor",
        // Stats fields
        sensorType: "",
        maxVoltage: "",
        sizeL: "",
        sizeW: "",
        sizeH: "",
        proxMin: "",
        proxMax: "",
        distMin: "",
        distMax: "",
        fov: "",
        imu: "",
        cpr: "",
        // Links
        iconLink: "",
        cadLink: "",
        storeLink: "",
    });

    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("taglist") || "[]");
        setAvailableTags(stored);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleTag = (tagName) => {
        setFormData((prev) => {
            const isSelected = prev.tags.includes(tagName);
            const newTags = isSelected
                ? prev.tags.filter((t) => t !== tagName)
                : [...prev.tags, tagName];
            return { ...prev, tags: newTags };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newSensor = {
            editable: true,
            manufacturerId: formData.manufacturerId,

            name: formData.name,
            manufacturer: formData.manufacturer || "unknown",
            tags: formData.tags,
            stats: {
                type: "sensor",
                sensor_type: formData.sensorType || null,
                max_operating_voltage: Number(formData.maxVoltage) || null,
                size: [
                    Number(formData.sizeL) || null,
                    Number(formData.sizeW) || null,
                    Number(formData.sizeH) || null,
                ],
                proximity_sensor_range:
                    formData.proxMin || formData.proxMax
                        ? [
                              Number(formData.proxMin) || 0,
                              Number(formData.proxMax) || 0,
                          ]
                        : null,
                distance_sensor_range:
                    formData.distMin || formData.distMax
                        ? [
                              Number(formData.distMin) || 0,
                              Number(formData.distMax) || 0,
                          ]
                        : null,
                fov: Number(formData.fov) || null,
                imu: formData.imu || null,
                cpr: Number(formData.cpr) || null,
            },
            quantity: 0,
            needed: 0,
            icon: formData.iconLink,
            links: {
                CAD: formData.cadLink,
                Store: formData.storeLink,
            },
        };

        createNewItem(newSensor);
        onClose();
    };

    return (
        <>
            <button className="d-partoverlay-returnbutton" onClick={onReturn}>
                &lt;
            </button>
            <div className="d-createitem-centercontainer">
                <form onSubmit={handleSubmit} className="d-createitem-form">
                    <h3 className="d-createitem-form-subtitle">
                        Sensor Specifications
                    </h3>
                    <hr className="d-createitem-form-divider"></hr>

                    <h4 className="d-createitem-form-subtitle2">Basic Info:</h4>
                    <div className="d-createitem-input-group">
                        <label>Name:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="name"
                                placeholder="e.g. Color Sensor V2"
                                value={formData.name}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.name?.length || 0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.name?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - (formData.name?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer ID:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturerId"
                                placeholder="e.g. REV-31-1537"
                                value={formData.manufacturerId}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturerId?.length ||
                                            0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturerId?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 -
                                        (formData.manufacturerId?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturer"
                                placeholder="e.g. rev"
                                value={formData.manufacturer}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturer?.length || 0) >=
                                        25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturer?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - (formData.manufacturer?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="d-createitem-input-group">
                        <label>Tags:</label>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginTop: "10px",
                            }}
                        >
                            {availableTags.map((tag) => {
                                const isSelected = formData.tags.includes(
                                    tag.name,
                                );
                                const bgColor = isSelected
                                    ? tag.color || "#ccc"
                                    : "#333";
                                return (
                                    <div
                                        key={tag.name}
                                        onClick={() => toggleTag(tag.name)}
                                        style={{
                                            cursor: "pointer",
                                            padding: "6px 12px",
                                            borderRadius: "15px",
                                            fontSize: isPhone
                                                ? "2.5rem"
                                                : "0.75rem",
                                            fontWeight: "bold",
                                            backgroundColor: bgColor,
                                            color: isSelected
                                                ? getContrastYIQ(bgColor)
                                                : "#888",
                                            border: `1px solid ${isSelected ? tag.color : "#444"}`,
                                        }}
                                    >
                                        {tag.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Stats:</h4>

                    <div className="d-createitem-input-group">
                        <label>Sensor Type:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="sensorType"
                                placeholder="e.g. I2C"
                                value={formData.sensorType}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.sensorType?.length || 0) >=
                                        140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.sensorType?.length || 0) >= 140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 - (formData.sensorType?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Max Voltage (V):</label>
                        <input
                            type="number"
                            step="0.1"
                            max={99999}
                            name="maxVoltage"
                            value={formData.maxVoltage}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Size (L, W, H mm):</label>
                        <div style={{ display: "flex", gap: "5px" }}>
                            <input
                                type="number"
                                max={99999}
                                name="sizeL"
                                placeholder="L"
                                value={formData.sizeL}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                max={99999}
                                name="sizeW"
                                placeholder="W"
                                value={formData.sizeW}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                max={99999}
                                name="sizeH"
                                placeholder="H"
                                value={formData.sizeH}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Proximity Range (Min, Max mm):</label>
                        <div style={{ display: "flex", gap: "5px" }}>
                            <input
                                type="number"
                                max={99999}
                                name="proxMin"
                                placeholder="Min"
                                value={formData.proxMin}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                max={99999}
                                name="proxMax"
                                placeholder="Max"
                                value={formData.proxMax}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Distance Range (Min, Max mm):</label>
                        <div style={{ display: "flex", gap: "5px" }}>
                            <input
                                type="number"
                                max={99999}
                                name="distMin"
                                placeholder="Min"
                                value={formData.distMin}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                max={99999}
                                name="distMax"
                                placeholder="Max"
                                value={formData.distMax}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>FOV (°):</label>
                        <input
                            type="number"
                            max={99999}
                            name="fov"
                            value={formData.fov}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>IMU:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="imu"
                                placeholder="e.g. 6-Axis"
                                value={formData.imu}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.imu?.length || 0) >= 140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.imu?.length || 0) >= 140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 - (formData.imu?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>CPR:</label>
                        <input
                            type="number"
                            max={99999}
                            name="cpr"
                            value={formData.cpr}
                            onChange={handleChange}
                        />
                    </div>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Links:</h4>
                    <div className="d-createitem-input-group">
                        <label>Icon URL:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="iconLink"
                                value={formData.iconLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.iconLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.iconLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.iconLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>CAD Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="cadLink"
                                value={formData.cadLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.cadLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.cadLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.cadLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Store Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="storeLink"
                                value={formData.storeLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.storeLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.storeLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.storeLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="d-createitem-submit-button"
                    >
                        Create Sensor
                    </button>
                </form>
            </div>
        </>
    );
}

function Add3dPrinted({ onReturn, onClose }) {
    const isPhone = useIsPhone();
    const getContrastYIQ = (hexcolor) => {
        if (!hexcolor) return "black";

        // Remove hash
        let cleanHex = hexcolor.replace("#", "");

        // Convert 3-digit hex (#fff) to 6-digit (#ffffff)
        if (cleanHex.length === 3) {
            cleanHex = cleanHex
                .split("")
                .map((char) => char + char)
                .join("");
        }

        // If it's not a valid 6-digit hex now, just return black
        if (cleanHex.length !== 6) return "black";

        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);

        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        return yiq >= 128 ? "black" : "white";
    };

    const [formData, setFormData] = useState({
        manufacturerId: "",
        name: "",
        tags: [],
        manufacturer: "",
        // Stats
        sizeL: "",
        sizeW: "",
        sizeH: "",
        infill: "",
        filament: "",
        wallLoops: "",
        infillPattern: "grid",
        support: "false",
        supportType: "",
        onBuildplateOnly: "false",
        removeSmallOverhangs: "false",
        thresholdAngle: "",
        brimType: "",
        brimWidth: "",
        brimObjectGap: "",
        filamentAmount: "",
        cost: "",
        timeH: "",
        timeM: "",
        // Links
        iconLink: "",
        cadLink: "",
        storeLink: "",
    });

    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("taglist") || "[]");
        setAvailableTags(stored);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleTag = (tagName) => {
        setFormData((prev) => {
            const isSelected = prev.tags.includes(tagName);
            const newTags = isSelected
                ? prev.tags.filter((t) => t !== tagName)
                : [...prev.tags, tagName];
            return { ...prev, tags: newTags };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPrint = {
            editable: true,

            manufacturerId: formData.manufacturerId || null,
            name: formData.name,
            manufacturer: formData.manufacturer,
            tags: formData.tags,
            stats: {
                type: "3d-printed",
                size: [
                    Number(formData.sizeL) || null,
                    Number(formData.sizeW) || null,
                    Number(formData.sizeH) || null,
                ],
                infill: Number(formData.infill) || null,
                filament: formData.filament,
                wall_loops: Number(formData.wallLoops) || null,
                infill_pattern: formData.infillPattern,
                support: formData.support === "true",
                support_type: formData.supportType || null,
                on_buildplate_only: formData.onBuildplateOnly === "true",
                remove_small_overhangs:
                    formData.removeSmallOverhangs === "true",
                threshold_angle: Number(formData.thresholdAngle) || null,
                brim_type: formData.brimType,
                brim_width: Number(formData.brimWidth) || null,
                brim_object_gap: Number(formData.brimObjectGap) || null,
                filament_amount: Number(formData.filamentAmount) || null,
                cost: Number(formData.cost) || null,
                time: [Number(formData.timeH), Number(formData.timeM)],
            },
            quantity: 0,
            needed: 0,
            icon: formData.iconLink,
            links: {
                CAD: formData.cadLink,
                Store: formData.storeLink,
            },
        };

        createNewItem(newPrint);
        onClose();
    };

    return (
        <>
            <button className="d-partoverlay-returnbutton" onClick={onReturn}>
                &lt;
            </button>
            <div className="d-createitem-centercontainer">
                <form onSubmit={handleSubmit} className="d-createitem-form">
                    <h3 className="d-createitem-form-subtitle">
                        3D Print Specifications
                    </h3>
                    <hr className="d-createitem-form-divider" />

                    <h4 className="d-createitem-form-subtitle2">Basic Info:</h4>
                    <div className="d-createitem-input-group">
                        <label>Name:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="name"
                                placeholder="My Random Brick"
                                value={formData.name}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.name?.length || 0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.name?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - (formData.name?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer ID:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturerId"
                                value={formData.manufacturerId}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturerId?.length ||
                                            0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturerId?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 -
                                        (formData.manufacturerId?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturer"
                                value={formData.manufacturer}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturer?.length || 0) >=
                                        25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturer?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - (formData.manufacturer?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="d-createitem-input-group">
                        <label>Tags:</label>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginTop: "10px",
                            }}
                        >
                            {availableTags.map((tag) => {
                                const isSelected = formData.tags.includes(
                                    tag.name,
                                );
                                const bgColor = isSelected
                                    ? tag.color || "#ccc"
                                    : "#333";
                                return (
                                    <div
                                        key={tag.name}
                                        onClick={() => toggleTag(tag.name)}
                                        style={{
                                            cursor: "pointer",
                                            padding: "6px 12px",
                                            borderRadius: "15px",
                                            fontSize: isPhone
                                                ? "2.5rem"
                                                : "0.75rem",
                                            fontWeight: "bold",
                                            backgroundColor: bgColor,
                                            color: isSelected
                                                ? getContrastYIQ(bgColor)
                                                : "#888",
                                            border: `1px solid ${isSelected ? tag.color : "#444"}`,
                                        }}
                                    >
                                        {tag.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <hr className="d-createitem-form-divider" />
                    <h4 className="d-createitem-form-subtitle2">
                        Slicing Stats:
                    </h4>
                    <div className="d-createitem-input-group">
                        <label>Size (L, W, H mm):</label>
                        <div style={{ display: "flex", gap: "5px" }}>
                            <input
                                type="number"
                                max={99999}
                                name="sizeL"
                                placeholder="L"
                                value={formData.sizeL}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                max={99999}
                                name="sizeW"
                                placeholder="W"
                                value={formData.sizeW}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                max={99999}
                                name="sizeH"
                                placeholder="H"
                                value={formData.sizeH}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Filament Type:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="filament"
                                placeholder="e.g. PLA, PETG"
                                value={formData.filament}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.filament?.length || 0) >= 140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.filament?.length || 0) >= 140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 - (formData.filament?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Infill %:</label>
                        <input
                            type="number"
                            max={99999}
                            name="infill"
                            value={formData.infill}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Infill Pattern:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="infillPattern"
                                placeholder="e.g. grid, gyroid"
                                value={formData.infillPattern}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.infillPattern?.length || 0) >=
                                        140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.infillPattern?.length || 0) >= 140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 -
                                        (formData.infillPattern?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Wall Loops:</label>
                        <input
                            type="number"
                            max={99999}
                            name="wallLoops"
                            value={formData.wallLoops}
                            onChange={handleChange}
                        />
                    </div>

                    <hr className="d-createitem-form-divider" />
                    <h4 className="d-createitem-form-subtitle2">
                        Supports & Brim:
                    </h4>

                    <div className="d-createitem-input-group">
                        <label>Supports:</label>
                        <select
                            name="support"
                            value={formData.support}
                            onChange={handleChange}
                        >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Support Type:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="supportType"
                                placeholder="e.g. Tree, Snug"
                                value={formData.supportType}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.supportType?.length || 0) >=
                                        140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.supportType?.length || 0) >= 140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 - (formData.supportType?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>On Buildplate Only:</label>
                        <select
                            name="onBuildplateOnly"
                            value={formData.onBuildplateOnly}
                            onChange={handleChange}
                        >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Remove Small Overhangs:</label>
                        <select
                            name="removeSmallOverhangs"
                            value={formData.removeSmallOverhangs}
                            onChange={handleChange}
                        >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Threshold Angle (°):</label>
                        <input
                            type="number"
                            max={99999}
                            name="thresholdAngle"
                            value={formData.thresholdAngle}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Brim Type:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="brimType"
                                placeholder="e.g. Outer only"
                                value={formData.brimType}
                                maxLength={150}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.brimType?.length || 0) >= 140
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.brimType?.length || 0) >= 140 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {150 - (formData.brimType?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Brim Width (mm):</label>
                        <input
                            type="number"
                            max={99999}
                            name="brimWidth"
                            value={formData.brimWidth}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Brim Object Gap (mm):</label>
                        <input
                            type="number"
                            max={99999}
                            step="0.01"
                            name="brimObjectGap"
                            value={formData.brimObjectGap}
                            onChange={handleChange}
                        />
                    </div>

                    <hr className="d-createitem-form-divider" />
                    <h4 className="d-createitem-form-subtitle2">
                        Print Details:
                    </h4>

                    <div className="d-createitem-input-group">
                        <label>Filament Amount (g):</label>
                        <input
                            type="number"
                            max={99999}
                            step="0.01"
                            name="filamentAmount"
                            value={formData.filamentAmount}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Cost ($):</label>
                        <input
                            type="number"
                            max={99999}
                            step="0.01"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Print Time (H:M):</label>
                        <div style={{ display: "flex", gap: "5px" }}>
                            <input
                                type="number"
                                max={99999}
                                name="timeH"
                                placeholder="H"
                                value={formData.timeH}
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                max={99999}
                                name="timeM"
                                placeholder="M"
                                value={formData.timeM}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <hr className="d-createitem-form-divider" />
                    <h4 className="d-createitem-form-subtitle2">Links:</h4>
                    <div className="d-createitem-input-group">
                        <label>Icon URL:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="iconLink"
                                value={formData.iconLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.iconLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.iconLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.iconLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>CAD Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="cadLink"
                                value={formData.cadLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.cadLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.cadLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.cadLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Store Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="storeLink"
                                value={formData.storeLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.storeLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.storeLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.storeLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="d-createitem-submit-button"
                    >
                        Create 3D Print
                    </button>
                </form>
            </div>
        </>
    );
}

function AddMachined({ onReturn, onClose }) {
    const isPhone = useIsPhone();
    const getContrastYIQ = (hexcolor) => {
        if (!hexcolor) return "black";

        // Remove hash
        let cleanHex = hexcolor.replace("#", "");

        // Convert 3-digit hex (#fff) to 6-digit (#ffffff)
        if (cleanHex.length === 3) {
            cleanHex = cleanHex
                .split("")
                .map((char) => char + char)
                .join("");
        }

        // If it's not a valid 6-digit hex now, just return black
        if (cleanHex.length !== 6) return "black";

        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);

        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        return yiq >= 128 ? "black" : "white";
    };

    const [formData, setFormData] = useState({
        manufacturerId: "",
        name: "",
        tags: [],
        manufacturer: "",
        type: "machined",
        // Stats fields
        sizeL: "",
        sizeW: "",
        sizeH: "",
        // Links
        iconLink: "",
        cadLink: "",
        storeLink: "",
    });

    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("taglist") || "[]");
        setAvailableTags(stored);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleTag = (tagName) => {
        setFormData((prev) => {
            const isSelected = prev.tags.includes(tagName);
            const newTags = isSelected
                ? prev.tags.filter((t) => t !== tagName)
                : [...prev.tags, tagName];
            return { ...prev, tags: newTags };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMachined = {
            editable: true,
            manufacturerId: formData.manufacturerId || null,

            name: formData.name,
            manufacturer: formData.manufacturer || "",
            tags: formData.tags,
            stats: {
                type: "machined",
                size: [
                    Number(formData.sizeL) || 0,
                    Number(formData.sizeW) || 0,
                    Number(formData.sizeH) || 0,
                ],
            },
            quantity: 0,
            needed: 0,
            icon: formData.iconLink,
            links: {
                CAD: formData.cadLink,
                Store: formData.storeLink,
            },
        };

        createNewItem(newMachined);
        onClose();
    };

    return (
        <>
            <button className="d-partoverlay-returnbutton" onClick={onReturn}>
                &lt;
            </button>
            <div className="d-createitem-centercontainer">
                <form onSubmit={handleSubmit} className="d-createitem-form">
                    <h3 className="d-createitem-form-subtitle">
                        Machined Part Specifications
                    </h3>
                    <hr className="d-createitem-form-divider"></hr>

                    <h4 className="d-createitem-form-subtitle2">Basic Info:</h4>
                    <div className="d-createitem-input-group">
                        <label>Name:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="name"
                                placeholder="e.g. My Random Plate"
                                value={formData.name}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.name?.length || 0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.name?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - (formData.name?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer ID:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturerId"
                                placeholder="e.g. Custom-01"
                                value={formData.manufacturerId}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturerId?.length ||
                                            0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturerId?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 -
                                        (formData.manufacturerId?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturer"
                                placeholder="e.g. custom"
                                value={formData.manufacturer}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturer?.length || 0) >=
                                        25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturer?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - (formData.manufacturer?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Tags:</label>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginTop: "10px",
                            }}
                        >
                            {availableTags.map((tag) => {
                                const isSelected = formData.tags.includes(
                                    tag.name,
                                );
                                const bgColor = isSelected
                                    ? tag.color || "#ccc"
                                    : "#333";
                                const textColor = isSelected
                                    ? getContrastYIQ(bgColor)
                                    : "#888";
                                return (
                                    <div
                                        key={tag.name}
                                        onClick={() => toggleTag(tag.name)}
                                        style={{
                                            cursor: "pointer",
                                            padding: "6px 12px",
                                            borderRadius: "15px",
                                            fontSize: isPhone
                                                ? "2.5rem"
                                                : "0.75rem",
                                            fontWeight: "bold",
                                            textTransform: "capitalize",
                                            backgroundColor: bgColor,
                                            color: textColor,
                                            border: `1px solid ${isSelected ? tag.color : "#444"}`,
                                        }}
                                    >
                                        {tag.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Stats:</h4>

                    <div className="d-createitem-input-group">
                        <label>Length (mm):</label>
                        <input
                            max={99999}
                            type="number"
                            step="0.001"
                            name="sizeL"
                            value={formData.sizeL}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Width (mm):</label>
                        <input
                            max={99999}
                            type="number"
                            step="0.001"
                            name="sizeW"
                            value={formData.sizeW}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Thickness (mm):</label>
                        <input
                            max={99999}
                            type="number"
                            step="0.001"
                            name="sizeH"
                            value={formData.sizeH}
                            onChange={handleChange}
                        />
                    </div>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Links:</h4>

                    <div className="d-createitem-input-group">
                        <label>Icon URL:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="iconLink"
                                value={formData.iconLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.iconLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.iconLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.iconLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>CAD Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="cadLink"
                                value={formData.cadLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.cadLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.cadLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.cadLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Store Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="storeLink"
                                value={formData.storeLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.storeLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.storeLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.storeLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="d-createitem-submit-button"
                    >
                        Create Machined Part
                    </button>
                </form>
            </div>
        </>
    );
}

function AddOther({ onReturn, onClose }) {
    const isPhone = useIsPhone();
    const getContrastYIQ = (hexcolor) => {
        if (!hexcolor) return "black";

        // Remove hash
        let cleanHex = hexcolor.replace("#", "");

        // Convert 3-digit hex (#fff) to 6-digit (#ffffff)
        if (cleanHex.length === 3) {
            cleanHex = cleanHex
                .split("")
                .map((char) => char + char)
                .join("");
        }

        // If it's not a valid 6-digit hex now, just return black
        if (cleanHex.length !== 6) return "black";

        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);

        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        return yiq >= 128 ? "black" : "white";
    };

    const [formData, setFormData] = useState({
        manufacturerId: "",
        name: "",
        tags: [],
        manufacturer: "",
        type: "other",
        // Stats
        description: "",
        // Links
        iconLink: "",
        cadLink: "",
        storeLink: "",
    });

    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("taglist") || "[]");
        setAvailableTags(stored);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleTag = (tagName) => {
        setFormData((prev) => {
            const isSelected = prev.tags.includes(tagName);
            const newTags = isSelected
                ? prev.tags.filter((t) => t !== tagName)
                : [...prev.tags, tagName];
            return { ...prev, tags: newTags };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newOther = {
            editable: true,
            manufacturerId: formData.manufacturerId || null,
            name: formData.name,
            manufacturer: formData.manufacturer || "unknown",
            tags: formData.tags,
            stats: {
                type: "other",
                description: formData.description || "",
            },
            quantity: 0,
            needed: 0,
            icon: formData.iconLink,
            links: {
                CAD: formData.cadLink,
                Store: formData.storeLink,
            },
        };

        createNewItem(newOther);
        onClose();
    };

    return (
        <>
            <button className="d-partoverlay-returnbutton" onClick={onReturn}>
                &lt;
            </button>
            <div className="d-createitem-centercontainer">
                <form onSubmit={handleSubmit} className="d-createitem-form">
                    <h3 className="d-createitem-form-subtitle">
                        Miscellaneous Part Specifications
                    </h3>
                    <hr className="d-createitem-form-divider"></hr>

                    <h4 className="d-createitem-form-subtitle2">Basic Info:</h4>
                    <div className="d-createitem-input-group">
                        <label>Name:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="name"
                                placeholder="e.g. Battery Strap"
                                value={formData.name}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.name?.length || 0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.name?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - (formData.name?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer ID:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturerId"
                                placeholder="e.g. MISC-001"
                                value={formData.manufacturerId}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturerId?.length ||
                                            0) >= 25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturerId?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 -
                                        (formData.manufacturerId?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Manufacturer:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="manufacturer"
                                placeholder="e.g. Generic"
                                value={formData.manufacturer}
                                maxLength={30}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.manufacturer?.length || 0) >=
                                        25
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.manufacturer?.length || 0) >= 25 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {30 - (formData.manufacturer?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Tags (Select all that apply):</label>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginTop: "10px",
                            }}
                        >
                            {availableTags.map((tag) => {
                                const isSelected = formData.tags.includes(
                                    tag.name,
                                );
                                const bgColor = isSelected
                                    ? tag.color || "#ccc"
                                    : "#333";
                                const textColor = isSelected
                                    ? getContrastYIQ(bgColor)
                                    : "#888";
                                return (
                                    <div
                                        key={tag.name}
                                        onClick={() => toggleTag(tag.name)}
                                        style={{
                                            cursor: "pointer",
                                            padding: "6px 12px",
                                            borderRadius: "15px",
                                            fontSize: isPhone
                                                ? "2.5rem"
                                                : "0.75rem",
                                            fontWeight: "bold",
                                            textTransform: "capitalize",
                                            backgroundColor: bgColor,
                                            color: textColor,
                                            border: `1px solid ${isSelected ? tag.color : "#444"}`,
                                        }}
                                    >
                                        {tag.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Stats:</h4>

                    <div className="d-createitem-input-group">
                        <label>Description / Notes:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                width: "100%",
                            }}
                        >
                            <textarea
                                className="d-createitem-input"
                                name="description"
                                placeholder="Additional details..."
                                value={formData.description}
                                maxLength={550}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    minHeight: isPhone ? "400px" : "200px",
                                    paddingTop: "12px",
                                    paddingLeft: "12px",
                                    paddingRight: "12px",
                                    paddingBottom:
                                        (formData.description?.length || 0) >=
                                        500
                                            ? isPhone
                                                ? "120px"
                                                : "50px"
                                            : "12px",
                                    resize: "vertical",
                                    display: "block",
                                }}
                            />
                            {(formData.description?.length || 0) >= 500 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        bottom: "15px",
                                        right: "15px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {550 - (formData.description?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>
                    <hr className="d-createitem-form-divider"></hr>
                    <h4 className="d-createitem-form-subtitle2">Links:</h4>

                    <div className="d-createitem-input-group">
                        <label>Icon URL:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="iconLink"
                                value={formData.iconLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.iconLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.iconLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.iconLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>CAD Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="cadLink"
                                value={formData.cadLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.cadLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "100px",
                                }}
                            />
                            {(formData.cadLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.cadLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="d-createitem-input-group">
                        <label>Store Link:</label>
                        <div
                            style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <input
                                name="storeLink"
                                value={formData.storeLink}
                                maxLength={250}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    paddingRight:
                                        (formData.storeLink?.length || 0) >= 240
                                            ? isPhone
                                                ? "100px"
                                                : "45px"
                                            : "10px",
                                }}
                            />
                            {(formData.storeLink?.length || 0) >= 240 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        color: "red",
                                        pointerEvents: "none",
                                        fontSize: isPhone ? "4rem" : "inherit",
                                        lineHeight: "1",
                                    }}
                                >
                                    {250 - (formData.storeLink?.length || 0)}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="d-createitem-submit-button"
                    >
                        Create Part
                    </button>
                </form>
            </div>
        </>
    );
}

async function createNewItem(itemData) {
    let finalizedItem;
    const signedIn = isUserSignedIn();

    if (signedIn) {
        const { group: teamId, error } = await getUserGroup();

        if (teamId && !error) {
            const result = await cloudCreatePart(itemData, teamId);
            if (result.success) {
                finalizedItem = result.item;
            }
        } else {
            console.warn(
                "User signed in but no group found. Falling back to local.",
            );
        }
    }

    if (!finalizedItem) {
        const rawData = localStorage.getItem("partData") || "[]";
        const existingParts = JSON.parse(rawData);

        const nextId =
            existingParts.length > 0
                ? Math.max(...existingParts.map((p) => Number(p.id) || 0)) + 1
                : 1;

        finalizedItem = { ...itemData, id: nextId };
    }

    // Commit to localStorage as the local cache
    const currentLocalData = JSON.parse(
        localStorage.getItem("partData") || "[]",
    );
    localStorage.setItem(
        "partData",
        JSON.stringify([...currentLocalData, finalizedItem]),
    );
    window.dispatchEvent(new Event("storage"));
}
