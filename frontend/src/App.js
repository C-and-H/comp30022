import './App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import SignUp from "./Components/SignUp";
import { HashRouter } from "react-router-dom";
import Footer from './Components/pageFooter';
import NavigationBar from './Components/NavigationBar';
import HomePage from './Components/HomePage';
//const users = axios.get("/findAllUsers");

const API_URL = process.env.REACT_APP_URL || "http://localhost:8080"
const UserProfiles = () =>{
    const [userProfiles, setUserProfiles] = useState([]);
  
    const fetchUserProfiles = () =>{
      axios.get(API_URL + "/findAllUsers").then (res => {
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
    <div className = "App">
      <Router>
      <NavigationBar/>
        <Switch>
            <Route path="/signup">
                <SignUp />
                <UserProfiles/>
            </Route>
            <Route path="/">
                <HomePage />
            </Route>     
        </Switch>
      </Router>
      {/* <HomePage/> */}
      <Footer/>
    </div>
    
    // <div>
    //   <Header/>
    //     <h1>
    //       CRM Application
    //     </h1>
    //   <Footer/>

    // </div>
    // <Router>
    //     <div>
    //         <nav>
    //             <ul>
    //                 <li>
    //                     <Link to="/">Homo</Link>
    //                 </li>
    //                 <li>
    //                     <Link to="/signup">Register</Link>
    //                 </li>
                
    //             </ul>
    //         </nav>
    //         <Switch>
            
    //         <Route path="/signup">
    //             <SignUp />
    //         </Route>    
    //         <Route path="/">
    //             <Home />
                
    //         </Route>
    //         </Switch>
    //     </div>
    // </Router>
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
