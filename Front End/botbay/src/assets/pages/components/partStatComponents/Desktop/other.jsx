import React from "react";

function OtherList({ part }) {
    const { stats } = part || {};
    if (!stats) return null;

    const rows = [
        {
            label: "Description",
            value: stats.description ?? null,
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

export default OtherList;
