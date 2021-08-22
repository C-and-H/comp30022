import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import SignUp from "./Components/SignUp";
import { HashRouter } from "react-router-dom";


//const users = axios.get("/findAllUsers");

const UserProfiles = () =>{
    const [userProfiles, setUserProfiles] = useState([]);
  
    const fetchUserProfiles = () =>{
      axios.get("https://michael-frontend-1.herokuapp.com").then (res => {
        console.log(res)
        // data comes from res.data can be found from 'inspect'
        const data = res.data;
        setUserProfiles(data);
        console.log("bruh");
      })
    }
    
    useEffect(()=> {
      fetchUserProfiles(); 
    }, []);
    // user profile is set by setUserProfiles line 14
    return userProfiles.map((userProfiles, index) => {
      return(
        // key is unique
        <div key = {index}>
          <center><h1>{userProfiles.id}</h1></center>
        </div>
      ) 
    })
    // <center><h1>  </h1></center>
}


function App() {
  return (
    <Router>
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Homo</Link>
                    </li>
                    <li>
                        <Link to="/signup">Register</Link>
                    </li>
                
                </ul>
            </nav>
            <Switch>
            
            <Route path="/signup">
                <SignUp />
            </Route>    
            <Route path="/">
                <Home />
                
            </Route>
            </Switch>
        </div>
    </Router>
);

}

function Home(){
  return (
    <HashRouter>
        <div>
        <UserProfiles/>
        </div>
    </HashRouter>
    
  );
}




export default App;
