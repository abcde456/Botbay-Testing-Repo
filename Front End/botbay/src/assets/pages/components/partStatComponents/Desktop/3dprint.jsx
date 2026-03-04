import React from "react";

function PrintedList({ part }) {
    const { stats } = part || {};
    if (!stats) return null;

    const rows = [
        {
            label: "Dimensions",
            value:
                stats.size?.length === 3
                    ? `${stats.size[0]} x ${stats.size[1]} x ${stats.size[2]} mm`
                    : null,
        },
        {
            label: "Filament Type",
            value: stats.filament ?? null,
        },
        {
            label: "Filament Used",
            value:
                stats.filament_amount != null
                    ? `${stats.filament_amount} g`
                    : null,
        },
        {
            label: "Cost",
            value: stats.cost != null ? `$${stats.cost.toFixed(2)}` : null,
        },
        {
            label: "Print Time",
            value:
                Array.isArray(stats.time) &&
                stats.time.length === 2 &&
                stats.time.some((t) => Number(t) > 0)
                    ? `${stats.time[0]}h ${stats.time[1]}m`
                    : null,
        },
        {
            label: "Infill",
            value:
                stats.infill != null
                    ? `${stats.infill}%${stats.infill_pattern ? ` (${stats.infill_pattern} pattern)` : ""}`
                    : null,
        },
        {
            label: "Wall Loops",
            value: stats.wall_loops ?? null,
        },
        {
            label: "Supports",
            value:
                stats.support !== null
                    ? stats.support
                        ? `Enabled (${stats.support_type ?? "Standard"})`
                        : "Disabled"
                    : null,
        },
        {
            label: "On Buildplate Only",
            value:
                stats.on_buildplate_only != null
                    ? stats.on_buildplate_only
                        ? "Yes"
                        : "No"
                    : null,
        },
        {
            label: "Remove Small Overhangs",
            value:
                stats.remove_small_overhangs != null
                    ? stats.remove_small_overhangs
                        ? "Yes"
                        : "No"
                    : null,
        },
        {
            label: "Threshold Angle",
            value:
                stats.threshold_angle != null
                    ? `${stats.threshold_angle}°`
                    : null,
        },
        {
            label: "Brim",
            value:
                stats.brim_type !== "none" &&
                stats.brim_type != null &&
                stats.brim_type !== ""
                    ? `${stats.brim_type}${stats.brim_width ? ` (${stats.brim_width}mm)` : ""}`
                    : null,
        },
        {
            label: "Brim Object Gap",
            value:
                stats.brim_object_gap != null && stats.brim_object_gap !== ""
                    ? `${stats.brim_object_gap} mm`
                    : null,
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

export default PrintedList;
