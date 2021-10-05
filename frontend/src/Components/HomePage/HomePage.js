import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./HomePage.css"
import { Row, Col, Container, Button } from "react-bootstrap";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      // margin: theme.spacing(1),
      margin: 40,
    },
  },
}));

// display button
function ContainedButtons() {
  const classes = useStyles();
  const basic = localStorage.getItem("basic");

  if (basic) {
    return (
      <div className={classes.root}>
        <a href="/profile" className="btn btn-primary btn-homepage">
          Let's Get Started!
        </a>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <a href="/signup" className="btn btn-primary btn-homepage">
        Let's Get Started!
      </a>
    </div>
  );
}

// HomePage Component
class HomePage extends React.Component {
  render() {
    return (
      <div className="background">
      <Container className="homepage-container">
        <div>
        <div data-layer="91a140cd-7b11-4d76-9b05-b48b578b7e59" class="leadachieveSucceed">
          Lead.<br/>
          Achieve. Succeed.
        </div>
        </div>
        <div className="enter-btn">
        <ContainedButtons />
        </div>
        <div>
          <hr />
        </div>
        <div className="paragraph">
          <p>
          CandhCRM is a complete solution for managing all of 
          your customer information and interactions on a single 
          platform that’s always accessible. We offer 100% free tools for you and your team.
          </p>
        </div>
      </Container>
      </div>
    );
  };
}

export default HomePage;
