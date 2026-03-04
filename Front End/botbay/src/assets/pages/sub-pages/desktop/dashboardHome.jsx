import React, { useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer as ResponsiveContainerBar,
} from "recharts";

import "../../../styles/dashboard.css";
import { useMediaQuery } from "react-responsive";

function HomePageDesktop({ handleLowStockClick }) {
    const isPhone = useMediaQuery({ query: "(max-width: 1199px)" });

    const partDataRaw = localStorage.getItem("partData");
    const tagListRaw = localStorage.getItem("taglist");
    const batteryListRaw = localStorage.getItem("batteryList");

    const partData = useMemo(() => {
        try {
            return partDataRaw ? JSON.parse(partDataRaw) : [];
        } catch (e) {
            return [];
        }
    }, [partDataRaw]);

    const tagList = useMemo(() => {
        try {
            return tagListRaw ? JSON.parse(tagListRaw) : [];
        } catch (e) {
            return [];
        }
    }, [tagListRaw]);

    const batteryList = useMemo(() => {
        try {
            return batteryListRaw ? JSON.parse(batteryListRaw) : [];
        } catch (e) {
            return [];
        }
    }, [batteryListRaw]);

    const tagColorMap = useMemo(() => {
        return Object.fromEntries(tagList.map((t) => [t.name, t.color]));
    }, [tagList]);

    const chartData = useMemo(() => {
        const tagCounts = {};
        partData.forEach((part) => {
            part.tags?.forEach((tag) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        return Object.keys(tagCounts).map((tag) => ({
            name: tag,
            value: tagCounts[tag],
            fill: tagColorMap[tag] || "#44327a",
        }));
    }, [partData, tagColorMap]);

    const totalParts = partData.length;
    const totalQuantity = partData.reduce(
        (acc, part) => acc + (part.quantity || 0),
        0,
    );

    const mostUsedTag = useMemo(() => {
        return (
            [...chartData].sort((a, b) => b.value - a.value)[0]?.name || "None"
        );
    }, [chartData]);

    const criticalStock = useMemo(() => {
        return partData
            .filter((part) => part.quantity - part.needed < 0)
            .sort((a, b) => a.quantity - a.needed - (b.quantity - b.needed));
    }, [partData]);

    const [currentTime, setCurrentTime] = React.useState(Date.now());

    React.useEffect(() => {
        const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const sortedBatteriesByChargingTime = useMemo(() => {
        return [...batteryList]
            .filter((b) => b.mcStatus === true)
            .map((b) => {
                const elapsedMs = Math.max(0, Date.now() - b.toc);
                const elapsedHours = elapsedMs / 3600000;
                const gained =
                    (((b.chargerSpeed || 2) * elapsedHours) /
                        (b.capacity || 3)) *
                    100;
                const currentLevel = Math.min(
                    100,
                    Math.round((b.startLevel || 0) + gained),
                );
                return { ...b, currentLevel };
            })
            .sort((a, b) => b.currentLevel - a.currentLevel);
    }, [batteryList, currentTime]);

    const batteryTypeDistribution = useMemo(() => {
        const typeCounts = {};
        batteryList.forEach((battery) => {
            const type = battery.type;
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        return Object.keys(typeCounts).map((type) => ({
            name:
                type === "b" ? "Battery" : type === "dh" ? "Driver Hub" : type,
            value: typeCounts[type],
            fill:
                type === "b"
                    ? "#3b82f6"
                    : type === "dh"
                      ? "#10b981"
                      : "#8b5cf6",
        }));
    }, [batteryList]);

    const totalBatteries = batteryList.length;

    return (
        <>
            <div className="d-homepagecontainer">
                <div className="d-titlecontainer">
                    <p>Home</p>
                </div>
                <div className="d-gridcontainer-3c2r">
                    <div className="d-griditem-2r">
                        <p id="d-griditem-title">Members</p>
                        <table id="d-griditem-membertable">
                            <tbody>
                                <tr>
                                    <th>Members</th>
                                    <th>Admin</th>
                                </tr>
                                <tr>
                                    <td>Test@email.com</td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Test@email.com</td>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-griditem-membertable-bottombuttoncontainer">
                            <button id="d-griditem-membertable-bottombuttoncontainer-1">
                                Invite
                            </button>
                            <button id="d-griditem-membertable-bottombuttoncontainer-2">
                                Update
                            </button>
                        </div>
                    </div>

                    <div className="d-griditem-2r" style={{ gridColumn: 2 }}>
                        <p id="d-griditem-title">Parts</p>

                        <div
                            style={{
                                width: "100%",
                                height: "30vh",
                                marginTop: "10px",
                            }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={isPhone ? 80 : 40}
                                        outerRadius={isPhone ? 140 : 80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="#1d1e2c"
                                        strokeWidth={isPhone ? 8 : 2}
                                        isAnimationActive={true}
                                        activeShape={
                                            isPhone
                                                ? false
                                                : {
                                                      outerRadius: 80,
                                                      stroke: "#fff",
                                                      strokeWidth: 2,
                                                  }
                                        }
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.fill}
                                                style={{
                                                    outline: "none",
                                                    cursor: "pointer",
                                                    pointerEvents: "auto",
                                                }}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        trigger={isPhone ? "click" : "hover"}
                                        wrapperStyle={{
                                            color: "#fff",
                                            zIndex: 1000,
                                        }}
                                        contentStyle={{
                                            color: "#fff",
                                            backgroundColor: "#1d1e2c",
                                            border: "2px solid #44327a",
                                            borderRadius: "15px",
                                            fontSize: isPhone ? "3rem" : "12px",
                                            padding: "20px",
                                        }}
                                        itemStyle={{ color: "#fff" }}
                                        labelStyle={{ color: "#fff" }}
                                        cursor={{ fill: "transparent" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={{ padding: "0 20px", color: "white" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "8px 0",
                                    borderBottom:
                                        "1px solid rgba(255,255,255,0.05)",
                                    fontSize: "0.9rem",
                                }}
                            >
                                <span style={{ color: "#94a3b8" }}>
                                    Total Items
                                </span>
                                <span style={{ fontWeight: "600" }}>
                                    {totalParts}
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "8px 0",
                                    borderBottom:
                                        "1px solid rgba(255,255,255,0.05)",
                                    fontSize: "0.9rem",
                                }}
                            >
                                <span style={{ color: "#94a3b8" }}>
                                    Stock Volume
                                </span>
                                <span style={{ fontWeight: "600" }}>
                                    {totalQuantity}
                                </span>
                            </div>
                            <p
                                style={{
                                    marginTop: "15px",
                                    fontSize: "0.85rem",
                                    color: "#94a3b8",
                                    lineHeight: "1.5",
                                    textAlign: "center",
                                }}
                            >
                                Inventory is weighted toward{" "}
                                <span
                                    style={{
                                        color:
                                            tagColorMap[mostUsedTag] ||
                                            "#a78bfa",
                                        fontWeight: "600",
                                    }}
                                >
                                    {mostUsedTag}
                                </span>{" "}
                                components across {chartData.length} active
                                categories.
                            </p>
                        </div>

                        <div className="d-homedash-part-critical-container">
                            <p
                                style={{
                                    fontSize: "0.8rem",
                                    fontWeight: "700",
                                    color: "#ef4444",
                                    marginBottom: "10px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                Critical Stock ({criticalStock.length})
                            </p>
                            <div className="d-homedash-part-scroll-area">
                                {criticalStock.length > 0 ? (
                                    criticalStock.map((part, i) => (
                                        <div
                                            key={i}
                                            className="d-homedash-part-critical-item"
                                            onClick={() =>
                                                handleLowStockClick(part)
                                            }
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: "0.85rem",
                                                        color: "white",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    {part.name}
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: "0.7rem",
                                                        color: "#94a3b8",
                                                    }}
                                                >
                                                    {part.manufacturerId ||
                                                        "No ID"}
                                                </span>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <span
                                                    style={{
                                                        color: "#ef4444",
                                                        fontWeight: "700",
                                                        fontSize: "0.9rem",
                                                    }}
                                                >
                                                    {part.quantity -
                                                        part.needed}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p
                                        style={{
                                            fontSize: "0.8rem",
                                            color: "#64748b",
                                            textAlign: "center",
                                            marginTop: "10px",
                                        }}
                                    >
                                        All items in stock.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="d-griditem-2r" style={{ gridColumn: 3 }}>
                        <p id="d-griditem-title">Batteries</p>

                        {/* Battery Type Bar Chart */}
                        <div
                            style={{
                                width: "100%",
                                height: "200px",
                                marginTop: "10px",
                            }}
                        >
                            <ResponsiveContainerBar width="100%" height="100%">
                                <BarChart
                                    data={batteryTypeDistribution}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.05)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{
                                            fill: "rgba(255,255,255,0.05)",
                                        }}
                                        contentStyle={{
                                            backgroundColor: "#1d1e2c",
                                            border: "1px solid #44327a",
                                            borderRadius: "8px",
                                            fontSize: "16px",
                                            color: "#fff",
                                        }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        radius={[4, 4, 0, 0]}
                                        barSize={25}
                                    >
                                        {batteryTypeDistribution.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.fill}
                                                />
                                            ),
                                        )}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainerBar>
                        </div>

                        <div
                            className="d-homedash-part-critical-container"
                            style={{
                                marginTop: "10px",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "0.8rem",
                                    fontWeight: "700",
                                    color: "#94a3b8",
                                    marginBottom: "15px",
                                    textTransform: "uppercase",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 2,
                                    padding: "10px 0",
                                    margin: 0,
                                }}
                            >
                                Active Charging (
                                {sortedBatteriesByChargingTime.length})
                            </p>
                            {/* SCROLLABLE WRAPPER */}
                            <div
                                style={{
                                    flex: 1,
                                    overflowY: "auto",
                                    paddingRight: "4px",
                                    overflowX: "hidden",
                                }}
                            >
                                {sortedBatteriesByChargingTime.length > 0 ? (
                                    sortedBatteriesByChargingTime.map(
                                        (battery, i) => {
                                            const elapsedMs =
                                                currentTime - battery.toc;
                                            const elapsedMins = Math.max(
                                                0,
                                                Math.floor(elapsedMs / 60000),
                                            );
                                            const displayTime =
                                                elapsedMins >= 60
                                                    ? `${Math.floor(elapsedMins / 60)}h ${elapsedMins % 60}m`
                                                    : `${elapsedMins}m`;

                                            let statusColor = "#f97316";
                                            if (battery.currentLevel >= 90)
                                                statusColor = "#3b82f6";
                                            else if (battery.currentLevel >= 75)
                                                statusColor = "#10b981";
                                            else if (battery.currentLevel <= 20)
                                                statusColor = "#7c0000";

                                            return (
                                                <div
                                                    key={i}
                                                    className="d-homedash-charging-card"
                                                    style={{
                                                        display: "flex",
                                                        marginBottom: "12px",
                                                        background:
                                                            "rgba(255,255,255,0.03)",
                                                        borderRadius: "6px",
                                                        overflow: "hidden",
                                                        border: "1px solid rgba(255,255,255,0.05)",
                                                        transition:
                                                            "all 0.3s ease",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {/* INDIVIDUAL SIDEBAR ACCENT */}
                                                    <div
                                                        className="d-homedash-sidebar-accent"
                                                        style={{
                                                            backgroundColor:
                                                                statusColor,
                                                            // Pass the colors to the CSS animation
                                                            "--status-color-light": `${statusColor}33`, // 20% opacity
                                                            "--status-color-glow": `${statusColor}88`, // 50% opacity
                                                        }}
                                                    />

                                                    {/* CONTENT AREA */}
                                                    <div
                                                        style={{
                                                            flex: 1,
                                                            padding: "12px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent:
                                                                    "space-between",
                                                                marginBottom:
                                                                    "8px",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    flexDirection:
                                                                        "column",
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            "0.95rem",
                                                                        color: "white",
                                                                        fontWeight:
                                                                            "700",
                                                                    }}
                                                                >
                                                                    {
                                                                        battery.name
                                                                    }
                                                                    <span
                                                                        style={{
                                                                            color: statusColor,
                                                                            marginLeft:
                                                                                "10px",
                                                                        }}
                                                                    >
                                                                        {
                                                                            battery.currentLevel
                                                                        }
                                                                        %
                                                                    </span>
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            "0.65rem",
                                                                        color: "#64748b",
                                                                        textTransform:
                                                                            "uppercase",
                                                                    }}
                                                                >
                                                                    {battery.type ===
                                                                    "b"
                                                                        ? "Battery Pack"
                                                                        : "Driver Hub"}
                                                                </span>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    textAlign:
                                                                        "right",
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            "0.85rem",
                                                                        color: "white",
                                                                        fontWeight:
                                                                            "700",
                                                                        display:
                                                                            "block",
                                                                    }}
                                                                >
                                                                    {
                                                                        displayTime
                                                                    }
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            "0.55rem",
                                                                        color: "#475569",
                                                                        textTransform:
                                                                            "uppercase",
                                                                    }}
                                                                >
                                                                    Elapsed
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Battery Progress Bar */}
                                                        <div
                                                            style={{
                                                                width: "100%",
                                                                height: "6px",
                                                                background:
                                                                    "rgba(0,0,0,0.4)",
                                                                borderRadius:
                                                                    "3px",
                                                                overflow:
                                                                    "hidden",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: `${battery.currentLevel}%`,
                                                                    height: "100%",
                                                                    backgroundColor:
                                                                        statusColor,
                                                                    transition:
                                                                        "width 1s linear",
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )
                                ) : (
                                    <div
                                        style={{
                                            height: "100px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: "0.85rem",
                                                color: "#475569",
                                            }}
                                        >
                                            No active charging sessions.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePageDesktop;
