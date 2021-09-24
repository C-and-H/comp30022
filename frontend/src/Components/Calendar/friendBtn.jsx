import React, { Component } from "react";
import { Row, Col, Container, Button, ToggleButton, ButtonGroup } from 'react-bootstrap';

class FriendBtn extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      checked: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ checked: value});
  }

  

  render() {

    const { checked } = this.state;
    const { friend } = this.props;
    return (
    <ToggleButton 
      type="checkbox"
      id={friend.id}
      size="lg"
      variant="outline-info"
      checked={checked}
      onChange={ () => {
        if (checked) {
          this.setState({ checked: false});
        } else {
          this.setState( { checked: true});
        }
      }}
    >
      {friend.first_name + " " + friend.last_name}
    </ToggleButton>
    )
  }
}

export default FriendBtn;