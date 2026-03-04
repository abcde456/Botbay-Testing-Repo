import React from "react";

function ElectricalList({ part }) {
    const { stats } = part || {};
    if (!stats) return null;

    const rows = [
        {
            label: "Connectors",
            value: stats.connector_types?.join(", ") ?? null,
        },
        {
            label: "Voltage",
            value: stats.voltage != null ? `${stats.voltage} V` : null,
        },
        {
            label: "Capacity",
            value: stats.capacity != null ? `${stats.capacity} Ah` : null,
        },
        {
            label: "Wire Gauge",
            value: stats.wire_gauge != null ? `${stats.wire_gauge} AWG` : null,
        },
        {
            label: "Wire Length",
            value: stats.wire_length != null ? `${stats.wire_length} mm` : null,
        },
        {
            label: "Max Discharge",
            value:
                stats.max_discharge != null ? `${stats.max_discharge} A` : null,
        },
        {
            label: "Charge Rate",
            value:
                stats.charge_rates != null ? `${stats.charge_rates} C` : null,
        },
        {
            label: "Weight",
            value: stats.weight != null ? `${stats.weight} g` : null,
        },
        {
            label: "Replaceable Fuse",
            value:
                stats.replaceable_fuse != null
                    ? stats.replaceable_fuse
                        ? "Yes"
                        : "No"
                    : null,
        },
        {
            label: "Size",
            value:
                stats.size &&
                stats.size.length === 3 &&
                stats.size.every(
                    (v) => v !== null && v !== undefined && v !== "",
                )
                    ? stats.size.map((v) => `${v}mm`).join(", ")
                    : "",
        },
    ];

    return (
        <ul>
            {rows
                .filter((row) => row.value != null && row.value !== "")
                .map(({ label, value }) => (
                    <li key={label}>
                        <strong>{label}:</strong> {value}
                    </li>
                ))}
        </ul>
    );
}

export default ElectricalList;
