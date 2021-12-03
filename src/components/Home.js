import React from 'react'
import dotsLeft from '../pics/dotsLeft.png'
import dotsright from '../pics/dotsRight.png'
import photo from '../images/capture2.png'
import mainPageIllustration from '../pics/mainPageIllustration.png'
import { auth, googleAuthProvider } from "./firebase.js";
import {useDispatch} from "react-redux";
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux'
function Home() {
    let history = useHistory();
    function handleclick(){
        history.push('/dashboard');
    }

  function login(){
    window.location.href="/login"
}
function logout(){
  auth.signOut()
  dispatch({
    type : "LOGOUT",
    payload : null,

  });
  
}
let dispatch = useDispatch()

let {user} = useSelector((state) => ({...state}));

    return (
        <div>
            <img
    src={dotsLeft}
    alt=""
    style=
    {{  position: "absolute",
      width: 145,
      height: 145,
      left: 5,
      top: 123
    }}
  />
  <img
    src={dotsright}
    alt=""
    style={{position: "absolute", right: 0, top: 250}}
  />
  <div
    className="navbar-home d-flex justify-content-between align-items-center p-1" style={{backgroundColor:'#f2f2f5'}}
  >
    <div className="d-flex justify-content-center align-items-center">
    <img
          src={photo}
          width="100"
          height="100"
          className="d-inline-block"
          alt=""
        />
      <h5>HDOCS</h5>
    </div>
    {!user && (
              <button onClick={login}  style={{height:"50px",width:"140px",padding:"0px"}}>Login</button>
            )}
            {user && (
              <button onClick={logout}  style={{height:"50px",width:"140px",padding:"0px"}}>Logout</button>
            )}
  </div>
  <div className="d-flex justify-content-between align-items-end container">
    <div className="d-flex flex-column">
      <div className="main-title">
        Decentralizing <br />
        Record Sharing ⚡
      </div>
      <div className="subtitle-home">
        Share your Health Records safely and securely with HDOCS
      </div>
       
        <button onClick={handleclick}>Get Started</button>

      
    </div>
    <div><img src={mainPageIllustration} alt="" /></div>
  </div>
            
        </div>
    )
}

export default Home