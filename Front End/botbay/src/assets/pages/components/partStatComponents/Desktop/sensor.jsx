import React from "react";

function SensorList({ part }) {
    const { stats } = part || {};
    if (!stats || stats.type !== "sensor") return null;

    const rows = [
        {
            label: "Size",
            value:
                stats.size &&
                stats.size.length === 3 &&
                stats.size.every((v) => v != null && v !== 0)
                    ? stats.size.map((v) => `${v} mm`).join(" × ")
                    : null,
        },
        {
            label: "Sensor Type",
            value: stats.sensor_type ?? null,
        },
        {
            label: "Max Operating Voltage",
            value:
                stats.max_operating_voltage != null
                    ? `${stats.max_operating_voltage} V`
                    : null,
        },
        {
            label: "Proximity Range",
            value:
                stats.proximity_sensor_range &&
                stats.proximity_sensor_range.every((v) => v != null)
                    ? `${stats.proximity_sensor_range[0]}–${stats.proximity_sensor_range[1]} mm`
                    : null,
        },
        {
            label: "Distance Range",
            value:
                stats.distance_sensor_range &&
                stats.distance_sensor_range.every((v) => v != null)
                    ? `${stats.distance_sensor_range[0]}–${stats.distance_sensor_range[1]} mm`
                    : null,
        },
        {
            label: "Field of View",
            value: stats.fov != null ? `${stats.fov}°` : null,
        },
        {
            label: "IMU",
            value: stats.imu != null || stats.imu != "" ? stats.imu : null,
        },
        {
            label: "Counts Per Revolution",
            value: stats.cpr != null ? stats.cpr : null,
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

export default SensorList;
