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

export function MotorStatList({ handleChange, formData }) {
    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Stats:</h4>

            <div className="d-createitem-input-group">
                <label>Connector Types (Comma Separated):</label>
                <input
                    /* CHANGED: Match megaSchema key 'connectorTypes' */
                    name="connectorTypes"
                    placeholder="JST-VH-2, Anderson Powerpoles"
                    /* CHANGED: Reference camelCase key from flat formData */
                    value={formData.connectorTypes || ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Max Power (W):</label>
                <input
                    type="number"
                    /* CHANGED: Match megaSchema key 'maxPower' */
                    name="maxPower"
                    value={formData.maxPower ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Stall Current (A):</label>
                <input
                    type="number"
                    /* CHANGED: Match megaSchema key 'stallCurrent' */
                    name="stallCurrent"
                    value={formData.stallCurrent ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Voltage (V):</label>
                <input
                    type="number"
                    /* KEEP: This already matched 'voltage' */
                    name="voltage"
                    value={formData.voltage ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Output Shaft Length (mm):</label>
                <input
                    type="number"
                    /* CHANGED: Match megaSchema key 'outputShaftLength' */
                    name="outputShaftLength"
                    value={formData.outputShaftLength ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>No-Load Speed (RPM):</label>
                <input
                    type="number"
                    /* CHANGED: Match megaSchema key 'noLoadSpeed' */
                    name="noLoadSpeed"
                    value={formData.noLoadSpeed ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Counts per Revolution:</label>
                <input
                    type="number"
                    /* KEEP: This already matched 'cpr' */
                    name="cpr"
                    value={formData.cpr ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Pulses per Revolution:</label>
                <input
                    type="number"
                    /* KEEP: This already matched 'ppr' */
                    name="ppr"
                    value={formData.ppr ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Stall Torque (Nm):</label>
                <input
                    type="number"
                    /* CHANGED: Match megaSchema key 'stallTorque' */
                    name="stallTorque"
                    value={formData.stallTorque ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Shaft Type:</label>
                <input
                    /* CHANGED: Match megaSchema key 'shaftType' */
                    name="shaftType"
                    value={formData.shaftType ?? ""}
                    onChange={handleChange}
                />
            </div>

            <hr className="d-createitem-form-divider" />
        </>
    );
}

export function ServoStatList({ handleChange, formData }) {
    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Stats:</h4>

            <div className="d-createitem-input-group">
                <label>Size (L, W, H mm):</label>
                <div style={{ display: "flex", gap: "5px" }}>
                    <input
                        type="number"
                        step="0.1"
                        name="sizeL"
                        placeholder="L"
                        value={formData.sizeL ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        step="0.1"
                        name="sizeW"
                        placeholder="W"
                        value={formData.sizeW ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        step="0.1"
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
                    name="speed"
                    value={formData.speed ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Angular Range (°):</label>
                <input
                    type="number"
                    name="angularRange"
                    value={formData.angularRange ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Gear Material:</label>
                <input
                    name="gearMaterial"
                    placeholder="e.g. metal"
                    value={formData.gearMaterial ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Spline Type:</label>
                <input
                    name="splineType"
                    placeholder="e.g. 25T"
                    value={formData.splineType ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Spline Thread Type:</label>
                <input
                    name="splineThreadType"
                    placeholder="e.g. M3"
                    value={formData.splineThreadType ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Spline Internal Depth (mm):</label>
                <input
                    type="number"
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
                    name="stallTorque"
                    value={formData.stallTorque ?? ""}
                    onChange={handleChange}
                />
            </div>

            <hr className="d-createitem-form-divider" />
        </>
    );
}

export function StructuralStatList({ handleChange, formData }) {
    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Stats:</h4>

            <div className="d-createitem-input-group">
                <label>Length (mm):</label>
                <input
                    type="number"
                    step="0.1"
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

export function ElectricalStatList({ handleChange, formData }) {
    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Stats:</h4>

            <div className="d-createitem-input-group">
                <label>Connector Types (Comma separated):</label>
                <input
                    name="connectorTypes"
                    placeholder="e.g. Tamiya, XT60, Anderson Powerpoles"
                    value={formData?.connectorTypes ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Voltage (V):</label>
                <input
                    type="number"
                    step="0.1"
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
                    name="maxDischarge"
                    placeholder="e.g. 40"
                    value={formData?.maxDischarge ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Replaceable Fuse:</label>
                <input
                    name="replaceableFuse"
                    placeholder="e.g. 20A Mini Blade"
                    value={formData?.replaceableFuse ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Charge Rates:</label>
                <input
                    name="chargeRates"
                    placeholder="e.g. 2C"
                    value={formData?.chargeRates ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Weight (g):</label>
                <input
                    type="number"
                    step="0.1"
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
                        name="sizeL"
                        placeholder="L"
                        value={formData?.sizeL ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="sizeW"
                        placeholder="W"
                        value={formData?.sizeW ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
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

export function SensorStatList({ handleChange, formData }) {
    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Stats:</h4>

            <div className="d-createitem-input-group">
                <label>Sensor Type:</label>
                <input
                    name="sensorType"
                    placeholder="e.g. I2C, Analog, Digital"
                    value={formData?.sensorType ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Max Voltage (V):</label>
                <input
                    type="number"
                    step="0.1"
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
                        name="sizeL"
                        placeholder="L"
                        value={formData?.sizeL ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="sizeW"
                        placeholder="W"
                        value={formData?.sizeW ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
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
                        name="proxMin"
                        placeholder="Min"
                        value={formData?.proxMin ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
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
                        name="distMin"
                        placeholder="Min"
                        value={formData?.distMin ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
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
                    name="fov"
                    placeholder="e.g. 60"
                    value={formData?.fov ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>IMU:</label>
                <input
                    name="imu"
                    placeholder="e.g. 6-Axis, 9-Axis"
                    value={formData?.imu ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>CPR (Encoder Resolution):</label>
                <input
                    type="number"
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

export function ThreeDPrintedStatList({ handleChange, formData }) {
    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Slicing Stats:</h4>

            <div className="d-createitem-input-group">
                <label>Size (L, W, H mm):</label>
                <div style={{ display: "flex", gap: "5px" }}>
                    <input
                        type="number"
                        name="sizeL"
                        placeholder="L"
                        value={formData?.sizeL ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="sizeW"
                        placeholder="W"
                        value={formData?.sizeW ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="sizeH"
                        placeholder="H"
                        value={formData?.sizeH ?? ""}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="d-createitem-input-group">
                <label>Filament Type:</label>
                <input
                    name="filament"
                    placeholder="e.g. PLA, PETG, ABS"
                    value={formData?.filament ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Infill %:</label>
                <input
                    type="number"
                    name="infill"
                    placeholder="15"
                    value={formData?.infill ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Infill Pattern:</label>
                <input
                    name="infillPattern"
                    placeholder="e.g. grid, gyroid"
                    value={formData?.infillPattern ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Wall Loops:</label>
                <input
                    type="number"
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

            <div className="d-createitem-input-group">
                <label>Support Type:</label>
                <input
                    name="supportType"
                    placeholder="e.g. Tree, Snug"
                    value={formData?.supportType ?? ""}
                    onChange={handleChange}
                />
            </div>

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
                    name="thresholdAngle"
                    placeholder="30"
                    value={formData?.thresholdAngle ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Brim Type:</label>
                <input
                    name="brimType"
                    placeholder="e.g. auto, outer only"
                    value={formData?.brimType ?? ""}
                    onChange={handleChange}
                />
            </div>

            <div className="d-createitem-input-group">
                <label>Brim Width (mm):</label>
                <input
                    type="number"
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
                        name="timeH"
                        placeholder="H"
                        value={formData?.timeH ?? ""}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
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

export function MachinedStatList({ handleChange, formData }) {
    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Stats:</h4>

            <div className="d-createitem-input-group">
                <label>Length (mm):</label>
                <input
                    type="number"
                    step="0.001"
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

export function OtherStatList({ handleChange, formData }) {
    return (
        <>
            <h4 className="d-createitem-form-subtitle2">Stats:</h4>

            <div className="d-createitem-input-group">
                <label>Description / Notes:</label>
                <input
                    name="description"
                    placeholder="Additional details..."
                    value={formData?.description ?? ""}
                    onChange={handleChange}
                />
            </div>

            <hr className="d-createitem-form-divider" />
        </>
    );
}
