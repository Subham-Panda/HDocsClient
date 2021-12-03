import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";
import Home from "./Home";
import './Home.css'
import login from "./auth/Login"
import register from "./auth/Register"
import RegisterComplete from "./auth/completereg"
import { useSelector } from "react-redux";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";
import { auth } from './firebase'
import { useDispatch } from 'react-redux'
const App = () => {
  const dispatch = useDispatch()
  let { user } = useSelector((state) => ({ ...state }));
  let history = useHistory();

  console.log(user);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult()
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: {
            email: user.email,
            token: idTokenResult.token,
          },
        });
      }
    });
    return () => unsubscribe();
  }, [])
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path='/login' component={login} />
          <Route exact path='/register' component={register} />
          <Route exact path='/register/complete' component={RegisterComplete} />
          {
            user ?
            <Route exact path="/dashboard" component={user.email === "im.sspanda2001@gmail.com" ? DoctorDashboard : PatientDashboard} />
            : null
          }
          
        </Switch>
      </div>
    </Router>
  );
};

export default App;
