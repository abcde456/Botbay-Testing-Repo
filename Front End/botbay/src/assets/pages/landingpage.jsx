import React from 'react';
import { useRef } from "react";
import { useMediaQuery } from 'react-responsive'
import '../styles/landingpage.css'
import '../styles/sharedstyles.css'
import { switchToPage,WikiUrl } from '../scripts/navigation.js';

import multiDeviceIcon from '../images/multideviceicon.png';
import listIcon from '../images/listicon.png';
import bookIcon from '../images/bookicon.png';
import navlogo from '../images/LogoTrans.png';
import stormLogo from '../images/stormlogo.png';
import knightsLogo from '../images/knightslogo.png';

function LandingPage() {
  const isDesktop = useMediaQuery({ query: '(min-width: 1100px)' });
  const goToSignUp = switchToPage('/signup');
  const goToSignIn = switchToPage('/signin');
  const goToDashboard = switchToPage('/dashboard');
  
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
                  <img draggable="false" className="navlogo" src={navlogo}></img>
                  <p className="navtitle">Botbay</p>
                </div>
              </div>
              <div className="halfcontainer">
                <div className="rightcontainer">
                  <div className="navtexthelper">
                    <p className="navunderlinebutton" onClick={goToWiki}>Wiki</p>
                    <p className="navunderlinebutton" onClick={scrollToAbout}>About</p>
                    <button className="navbutton" onClick={goToSignIn}>Sign In</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="herocontainer">
              <div className="halfcontainer">
                <div className="vertical33container">
                  <p className="herotitle">Keep Track of Your Team’s Parts With Ease</p>
                </div>
                <div className="vertical34container">
                  <div className="halfcontainer">
                    <div className="leftcontainer">
                      <ul>
                        <li>Multi-device syncing</li>
                        <li>Thorough interface</li>
                        <li>Keeps you organized</li>
                        <li>Useful utilities for all teams</li>
                      </ul>
                    </div>      
                  </div>
                  <div className="halfcontainer">
                    <div className="rowcontainer">
                      <img draggable="false" className="heroicon" src={multiDeviceIcon}></img>
                      <img draggable="false" className="heroicon" src={listIcon}></img>
                      <img draggable="false" className="heroicon" src={bookIcon}></img>
                    </div>
                  </div>
                </div>
                <div className="vertical33container">
                  <div className="evenspreadflex">
                    <button className="herobutton" onClick={goToSignUp}>Sign Up</button>
                    <button className="herobutton"  onClick={goToDashboard}>Try it Out</button>
                  </div>
                </div>
              </div>
              <div className="halfcontainer">

              </div>
            </div>
          </>
        ) : (
          <>
            <div className="navbar">
              <div className="halfcontainersmallnav">
                <img draggable="false" className="navlogo" src={navlogo}></img>
                <p className="navtitle">Botbay</p>
              </div>
              <div className="halfcontainer">
                <div className="navtexthelper">
                  <p className="navunderlinebutton">Wiki</p>
                  <p className="navunderlinebutton" onClick={scrollToAbout}>About</p>
                  <button className="navbutton">Sign In</button>
                </div>
              </div>
            </div>
            <div className="herocontainer">
                  <center>
                    <p className="herotitle">Keep Track of Your Team’s Parts With Ease</p>
                    <ul className="herolist">
                      <li>Multi-device syncing</li>
                      <li>Thorough interface</li>
                      <li>Keeps you organized</li>
                      <li>Useful utilities for all teams</li>
                    </ul>
                  </center>
                  <div className="rowcontainer">
                    <img draggable="false" className="heroicon" src={multiDeviceIcon}></img>
                    <img draggable="false" className="heroicon" src={listIcon}></img>
                    <img draggable="false" className="heroicon" src={bookIcon}></img>
                  </div>
                  <div className="evenspreadflex">
                    <button className="herobutton">Sign Up</button>
                    <button className="herobutton">Try it Out</button>
                  </div>
            </div>
          </>
        )}
      </div>
      <div className="aboutcontainer" ref={aboutRef}>
        <p className='herotitle'>What is Botbay?</p>
        <p className='abouttext'>Botbay is a revolutionary new system for robotics teams to keep track of their inventory. It is filled to the brim with countless features to make your life easier and keep your team organized.</p>
        <p className="abouttext">Compete stronger with the peace of mind of knowing you have everything you need to be ready at all your competitions.</p>
        <p className='abouttext'>Botbay is a collaborative effort built and designed by FTC Teams #16423 and #27966.</p>
        <div className="teamlogocontainer">
          <img  draggable="false" className="teamlogo" src={stormLogo}></img>
          <img draggable="false" className="teamlogo" src={knightsLogo}></img>
        </div>
      </div>
    </>
  );
}

export default LandingPage;