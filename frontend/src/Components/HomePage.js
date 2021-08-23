import React from "react";
// import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Navbar,Nav,Container,NavDropdown } from "react-bootstrap";
import { withStyles } from '@material-ui/core/styles';
import "../App.css"

// const styles =(theme) => ({
//     root: {
//       flexGrow: 1
//     },
//     paper: {
//       height: 140,
//       width: 200
//     },
//     control: {
//       padding: theme.spacing(2)
//     },
//     paragraph: {
//         textIndent:10
//     }
//   });
class HomePage extends React.Component {
    
    render() {
        // const {classes} = makeStyles();
        return (
            <div class="container">
            <div class="row">
                <div class="col-sm" id = "column-left">
                <h1>
                    What is CRM?
                </h1>
                <h2 style={{textAlign:"right"}}>
                —Customer Relationship Management
                </h2>
                {/* https://www.salesforce.com/crm/what-is-crm-infographic/ */}
                <p style={{textAlign:"justify"}} >
                It’s a platform that connects your different departments, 
                from marketing to sales to customer service, and organizes 
                their notes, activities, and metrics into one cohesive system. 
                Every user has easy, direct access to the real-time client data they need. 
                This not only allows for unparalleled coordination across teams and departments, 
                but also makes it possible for businesses to provide their customers with something 
                extra ordinary: personalize, one-to-one customer journeys. Compare that to the limited 
                functionality of old analogue and legacy systems, and you have something with the ability to revolutionize the way you connect with customers. You can’t define CRM software without taking into consideration SaaS and cloud computing, both of which work together to allow CRM platforms to be available wherever a user has internet. Because of these technologies, cloud-based CRM software can grow and scale with your business, so every company, no matter the size, can benefit from a CRM-software based system.
                </p>
                </div>
                <div class="col-sm">
                    
                </div>
            </div>
            </div>
            
        )}
}

// export default withStyles(styles)(HomePage);
export default HomePage;