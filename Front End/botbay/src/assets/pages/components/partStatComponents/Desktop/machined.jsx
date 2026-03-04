import React, { useState } from "react";

function MachinedList({ part }) {
    const { stats } = part || {};
    if (!stats) return null;

    const rows = [
        {
            label: "Size",
            value: stats.size?.map((v) => `${v}mm`).join(", ") ?? "",
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

export default MachinedList;
