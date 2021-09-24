import React, { Component } from "react";
import { Row, Col, Container, Button, ToggleButton, ButtonGroup } from 'react-bootstrap';

class FriendBtn extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      checked: false,
      btnText: ""
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    const { checked } = this.state;
    const { friend } = this.props;
    if (checked){
      this.setState({
         checked: false,
         btnText: friend.first_name + " " + friend.last_name
      });
      this.props.callBack(friend.id, false);
    } else {
      this.setState ({ 
        checked: true,
        btnText: friend.first_name + " " + friend.last_name + " (Selected)"
      });
      this.props.callBack(friend.id, true);
    }
  }

  componentDidMount() {
    const { friend } = this.props;
    this.setState( { btnText: friend.first_name + " " + friend.last_name});
  }

  

  render() {

    const { checked, btnText } = this.state;
    const { friend } = this.props;
    return (
    <ToggleButton 
      type="checkbox"
      id={friend.id}
      size="lg"
      variant="outline-info"
      checked={checked}
      onChange={ (id) => {
        this.handleChange(id);
      }}
    >
      {btnText}
    </ToggleButton>
    )
  }
}

export default FriendBtn;