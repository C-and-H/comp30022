import logo from './logo.svg';
import './App.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import SignUp from "./Components/SignUp";

function App() {
  return (
    <Router>
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
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
  return <h2>Home</h2>;
}

function Homo(){
  return <h2>bruh</h2>;
}


export default App;
