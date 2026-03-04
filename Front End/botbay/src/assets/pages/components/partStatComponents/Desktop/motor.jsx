import React, { useState } from "react";

function MotorList({ part }) {
    const { stats } = part || {};
    if (!stats) return null;

    const rows = [
        {
            label: "Connector Types",
            value: stats.connector_types?.join(", "),
        },
        {
            label: "Max Power",
            value: stats.max_power != null ? `${stats.max_power} W` : null,
        },
        {
            label: "Stall Current",
            value:
                stats.stall_current != null ? `${stats.stall_current} A` : null,
        },
        {
            label: "Voltage",
            value: stats.voltage != null ? `${stats.voltage} V` : null,
        },
        {
            label: "Output Shaft Length",
            value:
                stats.output_shaft_length != null
                    ? `${stats.output_shaft_length} mm`
                    : null,
        },
        {
            label: "No Load Speed",
            value:
                stats.no_load_speed != null
                    ? `${stats.no_load_speed} RPM`
                    : null,
        },
        {
            label: "CPR",
            value: stats.cpr,
        },
        {
            label: "PPR",
            value: stats.ppr,
        },
        {
            label: "Stall Torque",
            value:
                stats.stall_torque != null ? `${stats.stall_torque} Nm` : null,
        },
        {
            label: "Shaft Type",
            value: stats.shaft_type,
        },
    ];

    return (
        <ul>
            {rows
                .filter((row) => row.value != null && row.value !== "")
                .map(({ label, value }) => (
                    <li key={label}>
                        {label}: {value}
                    </li>
                ))}
        </ul>
    );
}

export default MotorList;
