import React, {Component, useState, useEffect} from 'react';
import axios from "axios";
import "../App.css"
import { Form, Input, Button, FormGroup, Label } from 'reactstrap';
import {useLocation} from "react-router-dom";
// import { Button,FormGroup,FormLabel,InputGroup,Form } from 'react-bootstrap';
// const API_URL = "https://crm-c-and-h-backend.herokuapp.com"
const API_URL = "http://localhost:8080"




function Verify(){

    const location = useLocation()
    return (
        <div>
           
            <Button onClick = {handler}>Click Here To Verify Your Email!</Button>
             
        </div>
    )

    async function handler(){
        
        await axios.get(API_URL + location.pathname).
        then(response =>{
            if (response.data === "Signup confirm success."){
                alert("Your email has been verified! Please login.");
            }else{
                alert("Something went wrong");
            }
        }).
        catch(err =>{
            alert("Something went wrong");
        })
        
    }
}



export default Verify;