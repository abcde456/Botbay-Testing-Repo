import React, { useState } from "react";

function ServoList({ part }) {
    const { stats } = part || {};
    if (!stats) return null;

    const rows = [
        {
            label: "Size",
            value: stats.size?.map((v) => `${v}mm`).join(", ") ?? "",
        },
        {
            label: "Max Power",
            value: stats.weight != null ? `${stats.weight} g` : null,
        },
        {
            label: "Stall Current",
            value:
                stats.stall_current != null ? `${stats.stall_current} A` : null,
        },
        {
            label: "Angular Range",
            value:
                stats.angular_range != null ? `${stats.angular_range}°` : null,
        },
        {
            label: "Gear Material",
            value:
                stats.gear_material != null ? `${stats.gear_material}` : null,
        },
        {
            label: "Voltage",
            value: stats.voltage != null ? `${stats.voltage} V` : null,
        },
        {
            label: "Speed",
            value: stats.speed != null ? `${stats.speed} s/60°` : null,
        },
        {
            label: "Stall Torque",
            value:
                stats.stall_torque != null ? `${stats.stall_torque} Nm` : null,
        },
        {
            label: "Spline Type",
            value: stats.spline_type != null ? `${stats.spline_type}` : null,
        },
        {
            label: "Spline Thread Type",
            value:
                stats.spline_thread_type != null
                    ? `${stats.spline_thread_type}`
                    : null,
        },
        {
            label: "Spline Internal Thread Depth",
            value:
                stats.spline_internal_depth != null
                    ? `${stats.spline_internal_depth} mm`
                    : null,
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

export default ServoList;
