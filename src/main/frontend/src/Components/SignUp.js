import React, {Component, useState, useEffect} from 'react';
import axios from "axios";
import "../App.css"


class SignUp extends Component{


    constructor(){
        super();
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
    }
    state = {
        userEmail: "",
        userPassword: "",
        userFirstName: "",
        userLastName: ""
    };

    handleEmail(event){
        //console.log(event.target.value);
        this.setState({userEmail: event.target.value});
        //console.log(this.state.userEmail);
    }

    handlePassword(event){
        this.setState({userPassword: event.target.value});
    }

    handleFirstName(event){
        this.setState({userFirstName: event.target.value});
    }

    handleLastName(event){
        this.setState({userLastName: event.target.value});
    }

    handleSubmit(event){
        const user = {
            email: this.state.userEmail,
            password: this.state.userPassword,
            first_name: this.state.userFirstName,
            last_nameL: this.state.userLastName
        }
        axios.post("/signup", user).
            then(response => {
                if (response.data != null){
                    //console.log(response.data);
                    alert("Sign up was successful.");
                }else{
                    alert("caibi");
                }
            })
            .catch(err => {
                alert("caibi");
            });
        event.preventDefault();
    }

    render(){
        return (
            <form onSubmit= {this.handleSubmit}>
                <label> email: </label>
                <input type = "text" value = {this.state.userEmail} onChange = {this.handleEmail} />
                
                <label>password: </label>
                <input type = "text" value = {this.state.userPassword} onChange = {this.handlePassword} />
                
                

                <label>First name: </label>
                <input type = "text" value = {this.state.userFirstName} onChange = {this.handleFirstName} />

                <label>Last name: </label>
                <input type = "text" value = {this.state.userLastName} onChange = {this.handleLastName} />

                <button type="submit">Submit</button>
            </form>
        );
    }

}

export default SignUp;