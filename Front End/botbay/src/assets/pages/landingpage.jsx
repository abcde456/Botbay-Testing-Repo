import React from "react";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import "../styles/landingpage.css";
import "../styles/sharedstyles.css";
import { switchToPage, WikiUrl } from "../scripts/navigation.js";

import { Link } from "react-router-dom";

import { FaInstagram, FaDiscord, FaEnvelope } from "react-icons/fa6";
import { MdShield } from "react-icons/md";

import multiDeviceIcon from "../images/multideviceicon.png";
import listIcon from "../images/listicon.png";
import bookIcon from "../images/bookicon.png";
import navlogo from "../images/LogoTrans.png";
import stormLogo from "../images/stormlogo.png";
import knightsLogo from "../images/knightslogo.png";
import dashboardImage from "../images/dashboard.png";

import landingImage1 from "../images/landingimagerest1.png";
import landingImage2 from "../images/landingimagerest2.png";

function LandingPage() {
    const isDesktop = useMediaQuery({ query: "(min-width: 1100px)" });
    const goToSignUp = switchToPage("/signup");
    const goToSignIn = switchToPage("/signin");
    const goToDashboard = switchToPage("/dashboard");

    const goToWiki = () => {
        window.open(WikiUrl);
    };

    const aboutRef = useRef(null);

    const scrollToAbout = () => {
        aboutRef.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <div className="screencontainer">
                {isDesktop ? (
                    <>
                        <div className="navbar">
                            <div className="halfcontainer">
                                <div className="leftcontainer">
                                    <img
                                        draggable="false"
                                        className="navlogo"
                                        src={navlogo}
                                    ></img>
                                    <p className="navtitle">Botbay</p>
                                </div>
                            </div>
                            <div className="halfcontainer">
                                <div className="rightcontainer">
                                    <div className="navtexthelper">
                                        <p
                                            className="navunderlinebutton"
                                            onClick={goToWiki}
                                        >
                                            Wiki
                                        </p>
                                        <p
                                            className="navunderlinebutton"
                                            onClick={scrollToAbout}
                                        >
                                            About
                                        </p>
                                        <button
                                            className="navbutton"
                                            onClick={goToSignIn}
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="herocontainer">
                            <div className="halfcontainer">
                                <div className="vertical33container">
                                    <p className="herotitle">
                                        Keep Track of Your Team’s Parts With
                                        Ease
                                    </p>
                                </div>
                                <div className="vertical34container">
                                    <div className="halfcontainer">
                                        <div className="leftcontainer">
                                            <ul>
                                                <li>Multi-device syncing</li>
                                                <li>Thorough interface</li>
                                                <li>Keeps you organized</li>
                                                <li>
                                                    Useful utilities for all
                                                    teams
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="halfcontainer">
                                        <div className="rowcontainer">
                                            <img
                                                draggable="false"
                                                className="heroicon"
                                                src={multiDeviceIcon}
                                            ></img>
                                            <img
                                                draggable="false"
                                                className="heroicon"
                                                src={listIcon}
                                            ></img>
                                            <img
                                                draggable="false"
                                                className="heroicon"
                                                src={bookIcon}
                                            ></img>
                                        </div>
                                    </div>
                                </div>
                                <div className="vertical33container">
                                    <div className="evenspreadflex">
                                        <button
                                            className="herobutton"
                                            onClick={goToSignUp}
                                        >
                                            Sign Up
                                        </button>
                                        <button
                                            className="herobutton"
                                            onClick={goToDashboard}
                                        >
                                            Try it Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="halfcontainer">
                                <img
                                    className="mainimage"
                                    alt="dashboard image"
                                    src={dashboardImage}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="navbar">
                            <div className="halfcontainersmallnav">
                                <img
                                    draggable="false"
                                    className="navlogo"
                                    src={navlogo}
                                ></img>
                                <p className="navtitle">Botbay</p>
                            </div>
                            <div className="halfcontainer">
                                <div className="navtexthelper">
                                    <p className="navunderlinebutton">Wiki</p>
                                    <p
                                        className="navunderlinebutton"
                                        onClick={scrollToAbout}
                                    >
                                        About
                                    </p>
                                    <button
                                        className="navbutton"
                                        onClick={goToSignIn}
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="herocontainer">
                            <center>
                                <p className="herotitle">
                                    Keep Track of Your Team’s Parts With Ease
                                </p>
                                <ul className="herolist">
                                    <li>Multi-device syncing</li>
                                    <li>Thorough interface</li>
                                    <li>Keeps you organized</li>
                                    <li>Useful utilities for all teams</li>
                                </ul>
                            </center>
                            <div className="rowcontainer">
                                <img
                                    draggable="false"
                                    className="heroicon"
                                    src={multiDeviceIcon}
                                ></img>
                                <img
                                    draggable="false"
                                    className="heroicon"
                                    src={listIcon}
                                ></img>
                                <img
                                    draggable="false"
                                    className="heroicon"
                                    src={bookIcon}
                                ></img>
                            </div>
                            <div className="evenspreadflex">
                                <button
                                    className="herobutton"
                                    onClick={goToSignUp}
                                >
                                    Sign Up
                                </button>
                                <button
                                    className="herobutton"
                                    onClick={goToDashboard}
                                >
                                    Try it Out
                                </button>
                            </div>
                            <div
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <img
                                    className="mainimage"
                                    alt="dashboard image"
                                    src={dashboardImage}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="aboutcontainer" ref={aboutRef}>
                <p className="herotitle">What is Botbay?</p>
                <p className="abouttext">
                    Botbay is a revolutionary new system for robotics teams to
                    keep track of their inventory. It is filled to the brim with
                    countless features to make your life easier and keep your
                    team organized.
                </p>
                <p className="abouttext">
                    Compete stronger with the peace of mind of knowing you have
                    everything you need to be ready at all your competitions.
                </p>
                <p className="abouttext">
                    Botbay is a collaborative effort built and designed by FTC
                    Teams #16423 and #27966.
                </p>
                <div className="teamlogocontainer">
                    <a
                        href="https://storm16423.ca/index.html"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            draggable="false"
                            className="teamlogo"
                            src={stormLogo}
                        />
                    </a>

                    <a
                        href="https://ftc-events.firstinspires.org/team/27966"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            draggable="false"
                            className="teamlogo"
                            src={knightsLogo}
                        />
                    </a>
                </div>
            </div>

            {isDesktop ? (
                <>
                    <div
                        className="landingherocontainer"
                        style={{
                            background:
                                "linear-gradient(to bottom, #000029 0%, #000029 15%, #000056 45%, #2b0056 75%, #002b56 100%)",
                        }}
                    >
                        <div className="halfcontainer">
                            <p
                                className="herotitle"
                                style={{ textAlign: "center" }}
                            >
                                Part Tracking
                            </p>
                            <p className="abouttext" style={{ width: "75%" }}>
                                Know every detail about every part in an instant
                            </p>
                        </div>
                        <div className="halfcontainer">
                            <img
                                className="mainimage"
                                alt="dashboard image"
                                src={landingImage1}
                            />
                        </div>
                    </div>

                    <div
                        className="landingherocontainer"
                        style={{
                            background:
                                "linear-gradient(to top, #000029 0%, #000029 15%, #000056 45%, #2b0056 75%, #002b56 100%)",
                        }}
                    >
                        <div className="halfcontainer">
                            <img
                                className="mainimage"
                                alt="dashboard image"
                                src={landingImage1}
                            />
                        </div>
                        <div className="halfcontainer">
                            <p
                                className="herotitle"
                                style={{ textAlign: "center" }}
                            >
                                Battery Tracking
                            </p>
                            <p className="abouttext" style={{ width: "75%" }}>
                                Forget about struggling to remember which
                                battery you put on the charger last
                            </p>
                        </div>
                    </div>

                    <div
                        className="landingherocontainer"
                        style={{
                            backgroundColor: "#000029",
                            flexDirection: "column",
                            gap: "30px",
                            userSelect: "none",
                            boxSizing: "border-box",
                        }}
                    >
                        <p
                            className="herotitle"
                            style={{ textAlign: "center" }}
                        >
                            Every Device. Every Member. One Tool.
                        </p>
                        <img
                            alt="dashboard image"
                            src={landingImage2}
                            style={{ width: "80%" }}
                        />
                        <div
                            style={{
                                width: "100%",
                                paddingBottom: "30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <button className="herobutton" onClick={goToSignUp}>
                                Elevate your team now.
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div
                        className="landingherocontainer"
                        style={{
                            background:
                                "linear-gradient(to bottom, #000029 0%, #000029 15%, #000056 45%, #2b0056 75%, #002b56 100%)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            padding: "30px 20px",
                            gap: "20px",
                            boxSizing: "border-box",
                        }}
                    >
                        <p className="herotitle">Part Tracking</p>

                        <p className="abouttext" style={{ maxWidth: "500px" }}>
                            Know every detail about every part in an instant
                        </p>

                        <img
                            className="mainimage"
                            alt="dashboard image"
                            src={landingImage1}
                            style={{ width: "100%", maxWidth: "500px" }}
                        />
                    </div>

                    <div
                        className="landingherocontainer"
                        style={{
                            background:
                                "linear-gradient(to top, #000029 0%, #000029 15%, #000056 45%, #2b0056 75%, #002b56 100%)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            padding: "30px 20px",
                            gap: "20px",
                            boxSizing: "border-box",
                        }}
                    >
                        <p className="herotitle">Battery Tracking</p>

                        <p className="abouttext" style={{ maxWidth: "500px" }}>
                            Forget about struggling to remember which battery
                            you put on the charger last
                        </p>

                        <img
                            className="mainimage"
                            alt="dashboard image"
                            src={landingImage1}
                            style={{ width: "100%", maxWidth: "500px" }}
                        />
                    </div>

                    <div
                        className="landingherocontainer"
                        style={{
                            backgroundColor: "#000029",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            gap: "30px",
                            userSelect: "none",
                            boxSizing: "border-box",
                        }}
                    >
                        <p className="herotitle">
                            Every Device. Every Member. One Tool.
                        </p>

                        <img
                            alt="dashboard image"
                            src={landingImage2}
                            style={{ width: "100%", maxWidth: "600px" }}
                        />

                        <div style={{ width: "100%", padding: "10px" }}>
                            <button className="herobutton" onClick={goToSignUp}>
                                Elevate your team now.
                            </button>
                        </div>
                    </div>
                </>
            )}

            <footer className="footer-container">
                <div className="footer-content">
                    <div className="footer-left">
                        <p className="footer-header">Socials</p>
                        <div className="footer-social-row">
                            <a
                                href="https://www.instagram.com/sdhs_stormbot16423/"
                                target="_blank"
                                rel="noreferrer"
                                className="footer-link"
                                title="16423 Instagram"
                            >
                                <FaInstagram
                                    style={{
                                        marginRight: "8px",
                                        verticalAlign: "middle",
                                    }}
                                />{" "}
                                16423 Instagram
                            </a>
                            <a
                                href="https://www.instagram.com/knightsofloopfunction/"
                                target="_blank"
                                rel="noreferrer"
                                className="footer-link"
                                title="27966 Instagram"
                            >
                                <FaInstagram
                                    style={{
                                        marginRight: "8px",
                                        verticalAlign: "middle",
                                    }}
                                />{" "}
                                27966 Instagram
                            </a>
                        </div>
                    </div>

                    <div className="footer-center">
                        <img
                            src={navlogo}
                            className="footer-logo"
                            alt="Botbay Logo"
                            onClick={() =>
                                window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                        />
                    </div>

                    <div className="footer-right">
                        <p className="footer-header">Resources</p>
                        <div>
                            <Link to="/privacy" className="footer-link">
                                <MdShield
                                    style={{
                                        cursor: "pointer",
                                        marginRight: "8px",
                                        verticalAlign: "middle",
                                    }}
                                />
                                Privacy Policy
                            </Link>
                            <a
                                href="mailto:botbay_contact@outlook.com"
                                className="footer-link"
                            >
                                <FaEnvelope
                                    style={{
                                        marginRight: "8px",
                                        verticalAlign: "middle",
                                    }}
                                />{" "}
                                Email
                            </a>
                            <a
                                href="https://discord.gg/73AJ2WuAJK"
                                target="_blank"
                                rel="noreferrer"
                                className="footer-link"
                            >
                                <FaDiscord
                                    style={{
                                        marginRight: "8px",
                                        verticalAlign: "middle",
                                    }}
                                />{" "}
                                Discord
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default LandingPage;
