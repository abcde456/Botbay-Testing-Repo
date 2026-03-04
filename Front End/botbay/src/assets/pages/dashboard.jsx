import "../styles/phone-dashboard.css";
import React, { useState, useEffect } from "react";
import "../styles/sharedstyles.css";
import "../styles/dashboard.css";
import { useMediaQuery } from "react-responsive";

import {
    FaHome,
    FaTools,
    FaBatteryFull,
    FaBars,
    FaTimes,
} from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

import HomePageDesktop from "./sub-pages/desktop/dashboardHome";

import PartsPageDesktop from "./sub-pages/desktop/dashboardParts";
import PartsPagePhone from "./sub-pages/phone/dashboardParts";

import BatteryPageDesktop from "./sub-pages/desktop/dashboardBattery";
import BatteryPagePhone from "./sub-pages/phone/dashboardBattery";

import SettingsPageDesktop from "./sub-pages/desktop/dashboardSettings";
import SettingsPagePhone from "./sub-pages/phone/dashboardSettings";

import sidebarLogo from "../images/LogoTrans.png";

function Dashboard() {
    const [partToRun, setPartToRun] = React.useState(null);
    const [usePartToRun, setUsePartToRun] = React.useState(false);
    const [pageIndex, setPageIndex] = React.useState(0);
    const [isMobileExpanded, setIsMobileExpanded] = React.useState(false);

    const isDesktop = useMediaQuery({ query: "(min-width: 1100px)" });

    function handleLowStockClick(part) {
        if (
            part.links.Store !== "" &&
            part.links.Store !== null &&
            part.links.Store !== undefined
        ) {
            window.open(part.links.Store, "_blank", "noopener,noreferrer");
        } else {
            setUsePartToRun(true);
            setPartToRun(part);
            setPageIndex(1);
        }
    }

    function handleReturnToDashboard() {
        setPageIndex(0);
    }

    function handleResetOfPart() {
        setUsePartToRun(false);
        setPartToRun(null);
    }

    const navItems = [
        { name: "Home", icon: <FaHome />, index: 0 },
        { name: "Parts", icon: <FaTools />, index: 1 },
        { name: "Batteries", icon: <FaBatteryFull />, index: 2 },
        { name: "Settings", icon: <IoMdSettings />, index: 3 },
    ];

    const renderPageContent = () => {
        if (isDesktop) {
            switch (pageIndex) {
                case 0:
                    return (
                        <HomePageDesktop
                            handleLowStockClick={handleLowStockClick}
                        />
                    );
                case 1:
                    return (
                        <PartsPageDesktop
                            partToRun={partToRun}
                            usePartToRun={usePartToRun}
                            onReturn={handleReturnToDashboard}
                            onReset={handleResetOfPart}
                        />
                    );
                case 2:
                    return <BatteryPageDesktop />;
                case 3:
                    return <SettingsPageDesktop />;
                default:
                    return <HomePageDesktop />;
            }
        } else {
            switch (pageIndex) {
                case 0:
                    return (
                        <HomePageDesktop
                            handleLowStockClick={handleLowStockClick}
                        />
                    );
                case 1:
                    return (
                        <PartsPageDesktop
                            partToRun={partToRun}
                            usePartToRun={usePartToRun}
                            onReturn={handleReturnToDashboard}
                            onReset={handleResetOfPart}
                        />
                    );
                case 2:
                    return <BatteryPageDesktop />;
                case 3:
                    return <SettingsPagePhone />;
                default:
                    return <HomePagePhone />;
            }
        }
    };

    return (
        <div className="dashboardscreencontainer">
            {!isDesktop && (
                <div
                    className={`phone-sidebar-overlay ${isMobileExpanded ? "phone-sidebar-overlay-active" : ""}`}
                    onClick={() => setIsMobileExpanded(false)}
                />
            )}

            {isDesktop ? (
                <div className="sidebar">
                    <img className="sidebarlogo" src={sidebarLogo} alt="logo" />
                    <div className="sidebaritemcontainer">
                        {navItems.map((item) => (
                            <div
                                key={item.index}
                                className={`sidebaritem ${pageIndex === item.index ? "sidebaritemhighlighted" : ""}`}
                                onClick={() => setPageIndex(item.index)}
                            >
                                <p>
                                    {item.icon}
                                    <span style={{ marginLeft: "12px" }}>
                                        {item.name}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div
                    className={`phone-sidebar ${isMobileExpanded ? "phone-sidebar-expanded" : ""}`}
                >
                    <div
                        className="phone-sidebar-toggle"
                        onClick={() => setIsMobileExpanded(!isMobileExpanded)}
                    >
                        {isMobileExpanded ? <FaTimes /> : <FaBars />}
                    </div>

                    {isMobileExpanded && (
                        <img
                            className="phone-sidebar-logo"
                            src={sidebarLogo}
                            alt="logo"
                        />
                    )}

                    <div className="phone-sidebar-item-container">
                        {navItems.map((item) => (
                            <div
                                key={item.index}
                                className={`phone-sidebar-item ${pageIndex === item.index ? "phone-sidebar-item-highlighted" : ""}`}
                                onClick={() => {
                                    setPageIndex(item.index);
                                    setIsMobileExpanded(false);
                                }}
                            >
                                <div className="phone-sidebar-icon-wrapper">
                                    {item.icon}
                                </div>
                                {isMobileExpanded && (
                                    <p className="phone-sidebar-text">
                                        {item.name}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="dashboardcontainer">{renderPageContent()}</div>
        </div>
    );
}

export default Dashboard;
