import React, { useMemo, useState, useEffect } from "react";
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

import {
    fetchGroupData,
    saveAdminList,
    inviteUserByUUID,
    removeMember,
    fetchInvitedUsers,
    removeInvitedUser,
} from "../../../scripts/auth.js";

import WarningPopup from "../../components/warningpopup";
import Blocker from "../../components/blocker";
import { MdContentCopy, MdCheck } from "react-icons/md";

function HomePageDesktop({ handleLowStockClick, handleBatteryClick }) {
    const [isPhone, setIsPhone] = useState(window.innerWidth < 1200);

    useEffect(() => {
        const handleResize = () => {
            setIsPhone(window.innerWidth < 1200);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const partDataRaw = localStorage.getItem("partData");
    const taglistRaw = localStorage.getItem("taglist");
    const batteryListRaw = localStorage.getItem("batteryList");

    const partData = useMemo(() => {
        try {
            return partDataRaw ? JSON.parse(partDataRaw) : [];
        } catch (e) {
            return [];
        }
    }, [partDataRaw]);

    const taglist = useMemo(() => {
        try {
            return taglistRaw ? JSON.parse(taglistRaw) : [];
        } catch (e) {
            return [];
        }
    }, [taglistRaw]);

    const batteryList = useMemo(() => {
        try {
            return batteryListRaw ? JSON.parse(batteryListRaw) : [];
        } catch (e) {
            return [];
        }
    }, [batteryListRaw]);

    const tagColorMap = useMemo(() => {
        return Object.fromEntries(taglist.map((t) => [t.name, t.color]));
    }, [taglist]);

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
        (acc, part) => acc + Number(part.quantity || 0),
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

    const [groupMembers, setGroupMembers] = useState([]);
    const [groupId, setGroupId] = useState(null);
    const [isInvitePopupOpen, setIsInvitePopupOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");

    const [invitedUsers, setInvitedUsers] = useState([]);

    useEffect(() => {
        const loadInvites = async () => {
            if (groupId !== undefined && groupId !== null) {
                const data = await fetchInvitedUsers(groupId);
                setInvitedUsers(data);
            }
        };
        loadInvites();
    }, [groupId]);

    useEffect(() => {
        console.log("Dashboard mounted, fetching members...");
        loadData();
    }, []);

    // 1. Fetching logic simplified
    const loadData = async () => {
        const result = await fetchGroupData();

        if (result.success) {
            setGroupMembers(result.members);
            setIsUserAdmin(result.isAdmin);
            setGroupId(result.groupId);
        } else {
            showNotice(result.error, true);
        }
    };
    // 2. Local toggle remains same (UI only)
    const handleAdminToggle = (userId) => {
        setGroupMembers((prev) =>
            prev.map((m) =>
                m.id === userId ? { ...m, isAdmin: !m.isAdmin } : m,
            ),
        );
    };

    // 3. Save logic calling auth.js
    const saveMemberUpdates = async () => {
        if (!groupId) return;

        // Filter the groupMembers state to get IDs of everyone checked as Admin
        const newAdminList = groupMembers
            .filter((m) => m.isAdmin)
            .map((m) => m.id);

        // Call the secure RPC
        const { success, message } = await saveAdminList(groupId, newAdminList);

        if (success) {
            showNotice(message); // Green popup
        } else {
            showNotice(message, true); // Red popup (shows "Unauthorized" if they tried to hack it)
            loadData(); // Revert the checkboxes to the real database state
        }
    };

    // 4. Invite logic calling auth.js
    const handleSendInvite = async () => {
        // 1. Validation
        if (!inviteEmail || !groupId) {
            showNotice("Please enter a valid UUID", true);
            return;
        }

        // 2. Call the RPC from auth.js
        const { success, message } = await inviteUserByUUID(
            inviteEmail,
            groupId,
        );

        // 3. Handle UI Response
        if (success) {
            showNotice(message); // Uses the green popup
            setIsInvitePopupOpen(false);
            setInviteEmail("");

            // Refresh the member list to show the new person
            loadData();
        } else {
            showNotice(message, true); // Uses the red popup
        }
    };

    const [statusPopup, setStatusPopup] = useState({
        show: false,
        message: "",
        isError: false,
    });

    const showNotice = (msg, isErr = false) => {
        setStatusPopup({ show: true, message: msg, isError: isErr });
        setTimeout(() => setStatusPopup({ ...statusPopup, show: false }), 3000);
    };

    const handleRemoveMember = async (userId) => {
        const { success, message } = await removeMember(userId, groupId);

        if (success) {
            setGroupMembers((prev) => prev.filter((m) => m.id !== userId));
            showNotice(message); // Green popup
        } else {
            showNotice(message, true); // Red popup with 'Unauthorized' text
        }
    };

    const [deletingUserId, setDeletingUserId] = useState(null);
    const [isUpdatingAdmins, setIsUpdatingAdmins] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);

    const handleUninvite = async (uuidToRemove) => {
        try {
            const updatedList = await removeInvitedUser(groupId, uuidToRemove);

            if (updatedList) {
                setInvitedUsers(updatedList);
            }
        } catch (err) {
            console.error("Failed to uninvite:", err);
        }
    };

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!groupId) return;
        navigator.clipboard.writeText(groupId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {statusPopup.show && (
                <div
                    style={{
                        position: "fixed",
                        bottom: isPhone ? "10%" : "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: statusPopup.isError
                            ? "#ff4d4d"
                            : "#4CAF50",
                        color: "white",
                        padding: isPhone ? "3rem 5rem" : "15px 30px",
                        borderRadius: "15px",
                        fontSize: isPhone ? "3.5rem" : "1.2rem",
                        zIndex: 1000,
                        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                        textAlign: "center",
                        width: isPhone ? "80%" : "auto",
                        transition: "all 0.3s ease",
                    }}
                >
                    {statusPopup.message}
                </div>
            )}
            {isInvitePopupOpen && (
                <div
                    className="d-createtagoverlay"
                    style={{ padding: isPhone ? "40px" : "20px" }}
                >
                    <Blocker />
                    <button
                        className="d-partoverlay-exitbutton"
                        onClick={() => setIsInvitePopupOpen(false)}
                        style={{ fontSize: isPhone ? "5rem" : "2rem" }}
                    >
                        X
                    </button>

                    <h2
                        style={{
                            fontSize: isPhone ? "4.5rem" : "2rem",
                            color: "white",
                        }}
                    >
                        Invite User
                    </h2>

                    <input
                        className="signupinput"
                        placeholder="User UUID"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        style={{
                            width: "90%",
                            height: isPhone ? "10rem" : "50px",
                            fontSize: isPhone ? "3.5rem" : "1rem",
                            marginTop: "20px",
                            paddingRight:
                                (inviteEmail?.length || 0) >= 230
                                    ? isPhone
                                        ? "100px"
                                        : "45px"
                                    : "10px",
                        }}
                    />

                    <button
                        className="signupbutton"
                        onClick={handleSendInvite}
                        style={{
                            width: "90%",
                            height: isPhone ? "10rem" : "50px",
                            fontSize: isPhone ? "3.5rem" : "1.2rem",
                            marginTop: "30px",
                        }}
                    >
                        Send Invite
                    </button>
                </div>
            )}
            <div className="d-homepagecontainer">
                <div className="d-titlecontainer">
                    <p>Home</p>
                </div>
                <div className="d-gridcontainer-3c2r">
                    <div
                        className="d-griditem-2r"
                        style={{ overflowX: "hidden" }}
                    >
                        {isUserAdmin ? (
                            <>
                                {/* Scrollable Container for both tables */}
                                <div
                                    className="members-section-wrapper"
                                    style={{
                                        height: isPhone ? "auto" : "450px",
                                        maxHeight: isPhone ? "none" : "75%",
                                        overflowY: isPhone ? "visible" : "auto",
                                        width: "100%",
                                        paddingRight: "10px",
                                    }}
                                >
                                    {/* --- MEMBERS TABLE --- */}
                                    <p
                                        style={{
                                            fontSize: isPhone
                                                ? "4rem"
                                                : "1.5rem",
                                            color: "white",
                                            marginBottom: "15px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Members
                                    </p>
                                    <table
                                        id="d-griditem-membertable"
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                        }}
                                    >
                                        <thead>
                                            <tr
                                                style={{
                                                    borderBottom:
                                                        "1px solid #444",
                                                }}
                                            >
                                                <th
                                                    style={{
                                                        fontSize: isPhone
                                                            ? "3rem"
                                                            : "1rem",
                                                        textAlign: "left",
                                                        padding: "10px",
                                                        color: "white",
                                                    }}
                                                >
                                                    Member
                                                </th>
                                                <th
                                                    style={{
                                                        fontSize: isPhone
                                                            ? "3rem"
                                                            : "1rem",
                                                        textAlign: "center",
                                                        padding: "10px",
                                                        color: "white",
                                                    }}
                                                >
                                                    Admin
                                                </th>
                                                <th
                                                    style={{
                                                        width: isPhone
                                                            ? "80px"
                                                            : "50px",
                                                    }}
                                                ></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupMembers.map((member) => (
                                                <tr
                                                    key={member.id}
                                                    className="member-row-hover"
                                                    style={{
                                                        height: isPhone
                                                            ? "12rem"
                                                            : "auto",
                                                        borderBottom:
                                                            "1px solid #222",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            fontSize: isPhone
                                                                ? "2.5rem"
                                                                : "1rem",
                                                            color: "white",
                                                            padding: "10px",
                                                        }}
                                                    >
                                                        {member.id.substring(
                                                            0,
                                                            8,
                                                        )}
                                                        ...
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                member.isAdmin
                                                            }
                                                            onChange={() =>
                                                                handleAdminToggle(
                                                                    member.id,
                                                                )
                                                            }
                                                            style={{
                                                                width: isPhone
                                                                    ? "4rem"
                                                                    : "20px",
                                                                height: isPhone
                                                                    ? "4rem"
                                                                    : "20px",
                                                            }}
                                                        />
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                setDeletingUserId(
                                                                    member.id,
                                                                )
                                                            }
                                                            style={{
                                                                background:
                                                                    "none",
                                                                border: "none",
                                                                color: "#ff4d4d",
                                                                fontSize:
                                                                    isPhone
                                                                        ? "4rem"
                                                                        : "1.5rem",
                                                                cursor: "pointer",
                                                            }}
                                                            className="member-row-hover-button"
                                                        >
                                                            X
                                                        </button>
                                                        {deletingUserId ===
                                                            member.id && (
                                                            <WarningPopup
                                                                message={`Remove ${member.id.substring(0, 8)}...?`}
                                                                complete={() => {
                                                                    handleRemoveMember(
                                                                        member.id,
                                                                    );
                                                                    setDeletingUserId(
                                                                        null,
                                                                    );
                                                                }}
                                                                close={() =>
                                                                    setDeletingUserId(
                                                                        null,
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* --- INVITED TABLE (Always Visible) --- */}
                                    <p
                                        style={{
                                            fontSize: isPhone
                                                ? "4rem"
                                                : "1.5rem",
                                            color: "white",
                                            marginTop: "40px",
                                            marginBottom: "15px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Invited
                                    </p>
                                    <table
                                        id="d-griditem-membertable"
                                        style={{
                                            width: "100%",
                                            borderCollapse: "collapse",
                                        }}
                                    >
                                        <thead>
                                            <tr
                                                style={{
                                                    borderBottom:
                                                        "1px solid #444",
                                                }}
                                            >
                                                <th
                                                    style={{
                                                        fontSize: isPhone
                                                            ? "3rem"
                                                            : "1rem",
                                                        textAlign: "left",
                                                        padding: "10px",
                                                        color: "white",
                                                    }}
                                                >
                                                    UUID
                                                </th>
                                                <th
                                                    style={{
                                                        fontSize: isPhone
                                                            ? "3rem"
                                                            : "1rem",
                                                        textAlign: "center",
                                                        padding: "10px",
                                                        color: "white",
                                                    }}
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    style={{
                                                        width: isPhone
                                                            ? "80px"
                                                            : "50px",
                                                    }}
                                                ></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invitedUsers.length > 0 ? (
                                                invitedUsers.map(
                                                    (invite, index) => {
                                                        // Handle if the JSONB item is just a string or an object
                                                        const displayId =
                                                            typeof invite ===
                                                            "string"
                                                                ? invite
                                                                : invite?.user_uuid ||
                                                                  invite?.id ||
                                                                  "Unknown";

                                                        return (
                                                            <tr
                                                                key={index}
                                                                style={{
                                                                    height: isPhone
                                                                        ? "12rem"
                                                                        : "auto",
                                                                    borderBottom:
                                                                        "1px solid #222",
                                                                }}
                                                            >
                                                                <td
                                                                    style={{
                                                                        fontSize:
                                                                            isPhone
                                                                                ? "2.5rem"
                                                                                : "1rem",
                                                                        color: "#aaa",
                                                                        padding:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    {displayId !==
                                                                    "Unknown"
                                                                        ? `${displayId.substring(0, 8)}...`
                                                                        : displayId}
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        fontSize:
                                                                            isPhone
                                                                                ? "2.5rem"
                                                                                : "1rem",
                                                                        color: "#eab308",
                                                                        textAlign:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    Pending
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        textAlign:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    <button
                                                                        onClick={() =>
                                                                            handleUninvite(
                                                                                displayId,
                                                                            )
                                                                        }
                                                                        style={{
                                                                            background:
                                                                                "none",
                                                                            border: "none",
                                                                            color: "#ff4d4d",
                                                                            fontSize:
                                                                                isPhone
                                                                                    ? "4rem"
                                                                                    : "1.5rem",
                                                                            cursor: "pointer",
                                                                        }}
                                                                        className="member-row-hover-button"
                                                                    >
                                                                        X
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    },
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        style={{
                                                            fontSize: isPhone
                                                                ? "3rem"
                                                                : "1rem",
                                                            color: "#666",
                                                            textAlign: "center",
                                                            padding: "40px",
                                                            fontStyle: "italic",
                                                        }}
                                                    >
                                                        No pending invites
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* --- ACTION BUTTONS --- */}
                                <div
                                    className="d-griditem-membertable-bottombuttoncontainer"
                                    style={{
                                        display: "flex",
                                        flexDirection: isPhone
                                            ? "column"
                                            : "row",
                                        gap: isPhone ? "30px" : "15px",
                                        width: "100%",
                                        padding: isPhone ? "20px 0" : "10px 0",
                                        marginTop: "10px",
                                    }}
                                >
                                    <button
                                        className="signupbutton"
                                        onClick={() =>
                                            setIsInvitePopupOpen(true)
                                        }
                                        style={{
                                            fontSize: isPhone ? "4rem" : "1rem",
                                            height: isPhone ? "12rem" : "50px",
                                            flex: 1,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        Invite
                                    </button>
                                    <button
                                        className="signupbutton"
                                        onClick={() =>
                                            setIsUpdatingAdmins(true)
                                        }
                                        style={{
                                            fontSize: isPhone ? "4rem" : "1rem",
                                            height: isPhone ? "12rem" : "50px",
                                            flex: 1,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        Update
                                    </button>
                                </div>

                                {isUpdatingAdmins && (
                                    <WarningPopup
                                        message="Update group permissions?"
                                        complete={() => {
                                            saveMemberUpdates();
                                            setIsUpdatingAdmins(false);
                                        }}
                                        close={() => setIsUpdatingAdmins(false)}
                                    />
                                )}
                                <div
                                    className="d-memberlist-idcard-container"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: isPhone ? "30px" : "15px 20px",
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.03)",
                                        borderRadius: "12px",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        marginTop: "20px",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "4px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: isPhone
                                                    ? "3rem"
                                                    : "0.75rem",
                                                color: "#666",
                                                fontWeight: "bold",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            Group ID
                                        </span>
                                        <code
                                            style={{
                                                fontSize: isPhone
                                                    ? "4rem"
                                                    : "1.2rem",
                                                color: "#ffffff", // Changed from teal to white
                                                fontFamily: "monospace",
                                            }}
                                        >
                                            {groupId || "—"}
                                        </code>
                                    </div>

                                    {/* The copy icon now changes based on the 'copied' state */}
                                    {copied ? (
                                        <MdCheck
                                            className="d-memberlist-idcard-copy-icon"
                                            size={isPhone ? "4rem" : "1.5rem"}
                                            style={{
                                                color: "#4caf50",
                                                cursor: "default",
                                            }} // Green check for feedback
                                        />
                                    ) : (
                                        <MdContentCopy
                                            className="d-memberlist-idcard-copy-icon"
                                            size={isPhone ? "4rem" : "1.5rem"}
                                            style={{
                                                color: "#ffffff",
                                                cursor: "pointer",
                                            }}
                                            onClick={handleCopy}
                                        />
                                    )}
                                </div>
                            </>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "300px",
                                    width: "100%",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: isPhone ? "4rem" : "1.2rem",
                                        color: "#888",
                                        fontStyle: "italic",
                                    }}
                                >
                                    Nothing to see here...
                                </p>
                            </div>
                        )}
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
                                {totalQuantity !== 0 ? (
                                    <>
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
                                        components across {chartData.length}{" "}
                                        active tags.
                                    </>
                                ) : (
                                    "You currently have 0 items."
                                )}
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
                                            style={{ cursor: "pointer" }}
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
                                            const ratePerHour =
                                                ((battery.chargerSpeed || 2) /
                                                    (battery.capacity || 3)) *
                                                100;

                                            let displayTime;

                                            if (battery.currentLevel >= 100) {
                                                displayTime = "Fully Charged";
                                            } else if (!ratePerHour) {
                                                displayTime = "—";
                                            } else {
                                                const remainingPercent =
                                                    100 - battery.currentLevel;

                                                const remainingMins = Math.ceil(
                                                    (remainingPercent /
                                                        ratePerHour) *
                                                        60,
                                                );

                                                displayTime =
                                                    remainingMins >= 60
                                                        ? `${Math.floor(remainingMins / 60)}h ${remainingMins % 60}m`
                                                        : `${remainingMins}m`;
                                            }

                                            let statusColor = "#f97316";
                                            if (battery.currentLevel >= 90)
                                                statusColor = "#3b82f6";
                                            else if (battery.currentLevel >= 75)
                                                statusColor = "#10b981";
                                            else if (battery.currentLevel <= 20)
                                                statusColor =
                                                    "rgb(239, 68, 68)";

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
                                                    onClick={handleBatteryClick}
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
                                                                    ETA
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
