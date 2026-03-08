import React, { useState, useEffect } from "react";

export const megaSchema = {
    // Basic Info (Shared by all)
    id: null,
    type: "",
    name: "",
    manufacturer: "",
    manufacturerId: "",
    tags: [],

    // Links (Shared by all)
    iconLink: "",
    cadLink: "",
    storeLink: "",

    // Physical Stats (Dimensions & Weight)
    sizeL: "",
    sizeW: "",
    sizeH: "",
    weight: "",

    // Motor & Servo Specific
    connectorTypes: "", // Used by Motor and Electrical
    voltage: "", // Used by Motor, Electrical, and Sensor
    maxPower: "",
    stallCurrent: "", // Used by Motor and Servo
    stallTorque: "", // Used by Motor and Servo
    noLoadSpeed: "",
    outputShaftLength: "",
    shaftType: "",
    cpr: "", // Used by Motor and Sensor
    ppr: "",
    speed: "",
    angularRange: "",
    gearMaterial: "",
    splineType: "",
    splineThreadType: "",
    splineInternalDepth: "",

    // Electrical Specific
    capacity: "",
    wireGauge: "",
    replaceableFuse: "",
    maxDischarge: "",
    wireLength: "",
    chargeRates: "",

    // Sensor Specific
    sensorType: "",
    maxVoltage: "",
    proxMin: "",
    proxMax: "",
    distMin: "",
    distMax: "",
    fov: "",
    imu: "",

    // 3D Printing Specific
    infill: "",
    filament: "",
    wallLoops: "",
    infillPattern: "",
    support: "",
    supportType: "",
    onBuildplateOnly: "",
    removeSmallOverhangs: "",
    thresholdAngle: "",
    brimType: "",
    brimWidth: "",
    brimObjectGap: "",
    filamentAmount: "",
    cost: "",
    timeH: "0",
    timeM: "",

    // Miscellaneous
    description: "", // From 'other'
};

export function assembleEditList(typeOfItem) {
    const template = schema[typeOfItem];
    // Return a new object based on the template, or an empty object if not found (basically safety in case we add wheel and forget that we have to actually put it here)
    return template ? { ...template } : {};
}

export function MotorStatList({ handleChange, formData, isPhone }) {
    const textLimit = 150;
    const trigger = 130;

    const renderTextInput = (name, label, placeholder = "") => {
        const val = formData[name] || "";
        const showCounter = val.length >= trigger;

        return (
            <div className="d-createitem-input-group">
                <label>{label}</label>
                <div style={{ position: "relative", width: "100%" }}>
                    <input
                        name={name}
                        placeholder={placeholder}
                        value={val}
                        onChange={(e) => {
                            const sliced = e.target.value.slice(0, textLimit);
                            handleChange({ target: { name, value: sliced } });
                        }}
                        style={{
                            width: "100%",
                            paddingRight: showCounter
                                ? isPhone
                                    ? "100px"
                                    : "45px"
                                : "10px",
                        }}
                    />
                    {showCounter && (
                        <p
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                margin: 0,
                                fontSize: isPhone ? "2.5rem" : "0.8rem",
                                color: "#ef4444",
                                pointerEvents: "none",
                            }}
                        >
                            {textLimit - val.length}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Stats:</h4>

            {renderTextInput(
                "connectorTypes",
                "Connector Types (Comma Separated):",
                "JST-VH-2, Anderson Powerpoles",
            )}

            <div className="d-createitem-input-group">
                <label>Max Power (W):</label>
                <input
                    type="number"
                    max={99999}
                    name="maxPower"
                    value={formData.maxPower ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Stall Current (A):</label>
                <input
                    type="number"
                    max={99999}
                    name="stallCurrent"
                    value={formData.stallCurrent ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Voltage (V):</label>
                <input
                    type="number"
                    max={99999}
                    name="voltage"
                    value={formData.voltage ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Output Shaft Length (mm):</label>
                <input
                    type="number"
                    max={99999}
                    name="outputShaftLength"
                    value={formData.outputShaftLength ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>No-Load Speed (RPM):</label>
                <input
                    type="number"
                    max={99999}
                    name="noLoadSpeed"
                    value={formData.noLoadSpeed ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Counts per Revolution:</label>
                <input
                    type="number"
                    max={99999}
                    name="cpr"
                    value={formData.cpr ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Pulses per Revolution:</label>
                <input
                    type="number"
                    max={99999}
                    name="ppr"
                    value={formData.ppr ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Stall Torque (Nm):</label>
                <input
                    type="number"
                    max={99999}
                    name="stallTorque"
                    value={formData.stallTorque ?? ""}
                    onChange={handleChange}
                />
            </div>

            {renderTextInput("shaftType", "Shaft Type:")}

            <hr className="d-createitem-form-divider" />
        </>
    );
}

export function ServoStatList({ handleChange, formData, isPhone }) {
    const textLimit = 150;
    const trigger = 130;

    const renderTextInput = (name, label, placeholder = "") => {
        const val = formData[name] || "";
        const showCounter = val.length >= trigger;

        return (
            <div className="d-createitem-input-group">
                <label>{label}</label>
                <div style={{ position: "relative", width: "100%" }}>
                    <input
                        name={name}
                        placeholder={placeholder}
                        value={val}
                        onChange={(e) => {
                            const sliced = e.target.value.slice(0, textLimit);
                            handleChange({ target: { name, value: sliced } });
                        }}
                        style={{
                            width: "100%",
                            paddingRight: showCounter
                                ? isPhone
                                    ? "100px"
                                    : "45px"
                                : "10px",
                        }}
                    />
                    {showCounter && (
                        <p
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                margin: 0,
                                fontSize: isPhone ? "2.5rem" : "0.8rem",
                                color: "#ef4444",
                                pointerEvents: "none",
                            }}
                        >
                            {textLimit - val.length}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
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
                        value={formData.sizeL ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        step="0.1"
                        max={99999}
                        name="sizeW"
                        placeholder="W"
                        value={formData.sizeW ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        step="0.1"
                        max={99999}
                        name="sizeH"
                        placeholder="H"
                        value={formData.sizeH ?? ""}
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
                    value={formData.weight ?? ""}
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
                    value={formData.speed ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Angular Range (°):</label>
                <input
                    type="number"
                    max={99999}
                    name="angularRange"
                    value={formData.angularRange ?? ""}
                    onChange={handleChange}
                />
            </div>

            {renderTextInput("gearMaterial", "Gear Material:", "e.g. metal")}
            {renderTextInput("splineType", "Spline Type:", "e.g. 25T")}
            {renderTextInput(
                "splineThreadType",
                "Spline Thread Type:",
                "e.g. M3",
            )}

            <div className="d-createitem-input-group">
                <label>Spline Internal Depth (mm):</label>
                <input
                    type="number"
                    max={99999}
                    name="splineInternalDepth"
                    value={formData.splineInternalDepth ?? ""}
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
                    value={formData.stallCurrent ?? ""}
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
                    value={formData.stallTorque ?? ""}
                    onChange={handleChange}
                />
            </div>

            <hr className="d-createitem-form-divider" />
        </>
    );
}

export function StructuralStatList({ handleChange, formData, isPhone }) {
    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Stats:</h4>

            <div className="d-createitem-input-group">
                <label>Length (mm):</label>
                <input
                    type="number"
                    step="0.1"
                    max={99999}
                    name="sizeL"
                    placeholder="e.g. 450"
                    value={formData?.sizeL ?? ""}
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
                    placeholder="e.g. 45"
                    value={formData?.sizeW ?? ""}
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
                    placeholder="e.g. 15"
                    value={formData?.sizeH ?? ""}
                    onChange={handleChange}
                />
            </div>

            <hr className="d-createitem-form-divider" />
        </>
    );
}

export function ElectricalStatList({ handleChange, formData, isPhone }) {
    const textLimit = 150;
    const trigger = 130;

    const renderTextInput = (name, label, placeholder = "") => {
        const val = formData?.[name] || "";
        const showCounter = val.length >= trigger;

        return (
            <div className="d-createitem-input-group">
                <label>{label}</label>
                <div style={{ position: "relative", width: "100%" }}>
                    <input
                        name={name}
                        placeholder={placeholder}
                        value={val}
                        onChange={(e) => {
                            const sliced = e.target.value.slice(0, textLimit);
                            handleChange({ target: { name, value: sliced } });
                        }}
                        style={{
                            width: "100%",
                            paddingRight: showCounter
                                ? isPhone
                                    ? "100px"
                                    : "45px"
                                : "10px",
                        }}
                    />
                    {showCounter && (
                        <p
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                margin: 0,
                                fontSize: isPhone ? "2.5rem" : "0.8rem",
                                color: "#ef4444",
                                pointerEvents: "none",
                            }}
                        >
                            {textLimit - val.length}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Stats:</h4>

            {renderTextInput(
                "connectorTypes",
                "Connector Types (Comma separated):",
                "e.g. Tamiya, XT60, Anderson Powerpoles",
            )}

            <div className="d-createitem-input-group">
                <label>Voltage (V):</label>
                <input
                    type="number"
                    step="0.1"
                    max={99999}
                    name="voltage"
                    placeholder="e.g. 12"
                    value={formData?.voltage ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Capacity (mAh):</label>
                <input
                    type="number"
                    max={99999}
                    name="capacity"
                    placeholder="e.g. 3000"
                    value={formData?.capacity ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Wire Gauge (AWG):</label>
                <input
                    type="number"
                    max={99999}
                    name="wireGauge"
                    placeholder="e.g. 14"
                    value={formData?.wireGauge ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Wire Length (mm):</label>
                <input
                    type="number"
                    max={99999}
                    name="wireLength"
                    placeholder="e.g. 150"
                    value={formData?.wireLength ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Max Discharge (A):</label>
                <input
                    type="number"
                    max={99999}
                    name="maxDischarge"
                    placeholder="e.g. 40"
                    value={formData?.maxDischarge ?? ""}
                    onChange={handleChange}
                />
            </div>

            {renderTextInput(
                "replaceableFuse",
                "Replaceable Fuse:",
                "e.g. 20A Mini Blade",
            )}
            {renderTextInput("chargeRates", "Charge Rates:", "e.g. 2C")}

            <div className="d-createitem-input-group">
                <label>Weight (g):</label>
                <input
                    type="number"
                    step="0.1"
                    max={99999}
                    name="weight"
                    placeholder="e.g. 250"
                    value={formData?.weight ?? ""}
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
                        value={formData?.sizeL ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        max={99999}
                        name="sizeW"
                        placeholder="W"
                        value={formData?.sizeW ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        max={99999}
                        name="sizeH"
                        placeholder="H"
                        value={formData?.sizeH ?? ""}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <hr className="d-createitem-form-divider" />
        </>
    );
}

export function SensorStatList({ handleChange, formData, isPhone }) {
    const textLimit = 150;
    const trigger = 130;

    const renderTextInput = (name, label, placeholder = "") => {
        const val = formData?.[name] || "";
        const showCounter = val.length >= trigger;

        return (
            <div className="d-createitem-input-group">
                <label>{label}</label>
                <div style={{ position: "relative", width: "100%" }}>
                    <input
                        name={name}
                        placeholder={placeholder}
                        value={val}
                        onChange={(e) => {
                            const sliced = e.target.value.slice(0, textLimit);
                            handleChange({ target: { name, value: sliced } });
                        }}
                        style={{
                            width: "100%",
                            paddingRight: showCounter
                                ? isPhone
                                    ? "100px"
                                    : "45px"
                                : "10px",
                        }}
                    />
                    {showCounter && (
                        <p
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                margin: 0,
                                fontSize: isPhone ? "2.5rem" : "0.8rem",
                                color: "#ef4444",
                                pointerEvents: "none",
                            }}
                        >
                            {textLimit - val.length}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Stats:</h4>

            {renderTextInput(
                "sensorType",
                "Sensor Type:",
                "e.g. I2C, Analog, Digital",
            )}

            <div className="d-createitem-input-group">
                <label>Max Voltage (V):</label>
                <input
                    type="number"
                    step="0.1"
                    max={99999}
                    name="maxVoltage"
                    placeholder="e.g. 5.0"
                    value={formData?.maxVoltage ?? ""}
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
                        value={formData?.sizeL ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        max={99999}
                        name="sizeW"
                        placeholder="W"
                        value={formData?.sizeW ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        max={99999}
                        name="sizeH"
                        placeholder="H"
                        value={formData?.sizeH ?? ""}
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
                        value={formData?.proxMin ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        max={99999}
                        name="proxMax"
                        placeholder="Max"
                        value={formData?.proxMax ?? ""}
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
                        value={formData?.distMin ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        max={99999}
                        name="distMax"
                        placeholder="Max"
                        value={formData?.distMax ?? ""}
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
                    placeholder="e.g. 60"
                    value={formData?.fov ?? ""}
                    onChange={handleChange}
                />
            </div>

            {renderTextInput("imu", "IMU:", "e.g. 6-Axis, 9-Axis")}

            <div className="d-createitem-input-group">
                <label>CPR (Encoder Resolution):</label>
                <input
                    type="number"
                    max={99999}
                    name="cpr"
                    placeholder="e.g. 28"
                    value={formData?.cpr ?? ""}
                    onChange={handleChange}
                />
            </div>

            <hr className="d-createitem-form-divider" />
        </>
    );
}

export function ThreeDPrintedStatList({ handleChange, formData, isPhone }) {
    const textLimit = 150;
    const trigger = 130;

    const renderTextInput = (name, label, placeholder = "") => {
        const val = formData?.[name] || "";
        const showCounter = val.length >= trigger;

        return (
            <div className="d-createitem-input-group">
                <label>{label}</label>
                <div style={{ position: "relative", width: "100%" }}>
                    <input
                        name={name}
                        placeholder={placeholder}
                        value={val}
                        onChange={(e) => {
                            const sliced = e.target.value.slice(0, textLimit);
                            handleChange({ target: { name, value: sliced } });
                        }}
                        style={{
                            width: "100%",
                            paddingRight: showCounter
                                ? isPhone
                                    ? "100px"
                                    : "45px"
                                : "10px",
                        }}
                    />
                    {showCounter && (
                        <p
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                margin: 0,
                                fontSize: isPhone ? "2.5rem" : "0.8rem",
                                color: "#ef4444",
                                pointerEvents: "none",
                            }}
                        >
                            {textLimit - val.length}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Slicing Stats:</h4>

            <div className="d-createitem-input-group">
                <label>Size (L, W, H mm):</label>
                <div style={{ display: "flex", gap: "5px" }}>
                    <input
                        type="number"
                        max={99999}
                        name="sizeL"
                        placeholder="L"
                        value={formData?.sizeL ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        max={99999}
                        name="sizeW"
                        placeholder="W"
                        value={formData?.sizeW ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        max={99999}
                        name="sizeH"
                        placeholder="H"
                        value={formData?.sizeH ?? ""}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {renderTextInput(
                "filament",
                "Filament Type:",
                "e.g. PLA, PETG, ABS",
            )}

            <div className="d-createitem-input-group">
                <label>Infill %:</label>
                <input
                    type="number"
                    max={99999}
                    name="infill"
                    placeholder="15"
                    value={formData?.infill ?? ""}
                    onChange={handleChange}
                />
            </div>

            {renderTextInput(
                "infillPattern",
                "Infill Pattern:",
                "e.g. grid, gyroid",
            )}

            <div className="d-createitem-input-group">
                <label>Wall Loops:</label>
                <input
                    type="number"
                    max={99999}
                    name="wallLoops"
                    placeholder="2"
                    value={formData?.wallLoops ?? ""}
                    onChange={handleChange}
                />
            </div>

            <hr className="d-createitem-form-divider" />
            <h4 className="d-createitem-form-subtitle2">Supports & Brim:</h4>

            <div className="d-createitem-input-group">
                <label>Supports:</label>
                <select
                    name="support"
                    value={formData?.support ?? "false"}
                    onChange={handleChange}
                >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </select>
            </div>

            {renderTextInput("supportType", "Support Type:", "e.g. Tree, Snug")}

            <div className="d-createitem-input-group">
                <label>On Buildplate Only:</label>
                <select
                    name="onBuildplateOnly"
                    value={formData?.onBuildplateOnly ?? "false"}
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
                    placeholder="30"
                    value={formData?.thresholdAngle ?? ""}
                    onChange={handleChange}
                />
            </div>

            {renderTextInput("brimType", "Brim Type:", "e.g. auto, outer only")}

            <div className="d-createitem-input-group">
                <label>Brim Width (mm):</label>
                <input
                    type="number"
                    max={99999}
                    name="brimWidth"
                    placeholder="5"
                    value={formData?.brimWidth ?? ""}
                    onChange={handleChange}
                />
            </div>

            <hr className="d-createitem-form-divider" />
            <h4 className="d-createitem-form-subtitle2">Print Details:</h4>

            <div className="d-createitem-input-group">
                <label>Filament Amount (g):</label>
                <input
                    type="number"
                    step="0.01"
                    max={99999}
                    name="filamentAmount"
                    placeholder="0.00"
                    value={formData?.filamentAmount ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Cost ($):</label>
                <input
                    type="number"
                    step="0.01"
                    max={99999}
                    name="cost"
                    placeholder="0.00"
                    value={formData?.cost ?? ""}
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
                        value={formData?.timeH ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        max={99999}
                        name="timeM"
                        placeholder="M"
                        value={formData?.timeM ?? ""}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <hr className="d-createitem-form-divider" />
        </>
    );
}

export function MachinedStatList({ handleChange, formData, isPhone }) {
    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Stats:</h4>
            <div className="d-createitem-input-group">
                <label>Length (mm):</label>
                <input
                    type="number"
                    step="0.001"
                    max={99999}
                    name="sizeL"
                    placeholder="0.000"
                    value={formData?.sizeL ?? ""}
                    onChange={handleChange}
                />
            </div>
            <div className="d-createitem-input-group">
                <label>Width (mm):</label>
                <input
                    type="number"
                    step="0.001"
                    max={99999}
                    name="sizeW"
                    placeholder="0.000"
                    value={formData?.sizeW ?? ""}
                    onChange={handleChange}
                />
            </div>
            <div className="d-createitem-input-group">
                <label>Thickness (mm):</label>
                <input
                    type="number"
                    step="0.001"
                    max={99999}
                    name="sizeH"
                    placeholder="0.000"
                    value={formData?.sizeH ?? ""}
                    onChange={handleChange}
                />
            </div>
            <hr className="d-createitem-form-divider" />
        </>
    );
}

export function OtherStatList({ handleChange, formData, isPhone }) {
    const textLimit = 150;
    const trigger = 130;
    const val = formData?.description || "";
    const showCounter = val.length >= trigger;

    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Stats:</h4>
            <div className="d-createitem-input-group">
                <label>Description / Notes:</label>
                <div style={{ position: "relative", width: "100%" }}>
                    <input
                        name="description"
                        placeholder="Additional details..."
                        value={val}
                        onChange={(e) => {
                            const sliced = e.target.value.slice(0, textLimit);
                            handleChange({
                                target: { name: "description", value: sliced },
                            });
                        }}
                        style={{
                            width: "100%",
                            paddingRight: showCounter
                                ? isPhone
                                    ? "100px"
                                    : "45px"
                                : "10px",
                        }}
                    />
                    {showCounter && (
                        <p
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                margin: 0,
                                fontSize: isPhone ? "2.5rem" : "0.8rem",
                                color: "#ef4444",
                                pointerEvents: "none",
                            }}
                        >
                            {textLimit - val.length}
                        </p>
                    )}
                </div>
            </div>
            <hr className="d-createitem-form-divider" />
        </>
    );
}
