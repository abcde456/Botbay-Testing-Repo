import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; 
import signUpLogo from '../images/LogoTrans.png';
import { switchToPage } from '../scripts/navigation.js';

import '../styles/signupstyles.css';
import '../styles/sharedstyles.css';

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const goToSignUp = switchToPage('/signup');
  const goToForgot = switchToPage('/forgotpassword');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="screencontainer">
      <div className="centercontainer">
        <div className="contentcontainer">
          <div className='logocontainer'>
            <img className="signuplogo" src={signUpLogo} alt="Logo" />
            <p className="signupheader">Botbay</p>
          </div>
          <div className="inputcontainer">
            <p className="inputheader">Email:</p>
            <input className="signupinput" type="email" placeholder="email@example.com" />

            <p className="inputheader">Password:</p>
            
            <div className="password-wrapper">
              <input 
                className="passwordinput" 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            <div className="bottomcontainer">
              <p className="bottomtext">Forgot your password? <span className="forgotpasswordspan" onClick={goToForgot}>Click here</span></p>
              <p className="bottomtext">Don't have an account yet? <span className="forgotpasswordspan" onClick={goToSignUp}>Click here</span></p>
              <p id="noticetext" style={{color: "transparent", fontSize: "0rem"}}>Hello</p>
            </div>
            <div className="bottomcontainer">
              <button className="signupbutton">Sign In</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;