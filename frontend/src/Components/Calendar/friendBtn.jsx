import React from "react";
import { ToggleButton } from "react-bootstrap";
import "./SetEvent.css";

class FriendBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      btnText: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const { checked } = this.state;
    const { friend } = this.props;
    if (checked) {
      this.setState({
        checked: false,
        btnText: friend.first_name + " " + friend.last_name,
      });
      this.props.callBack(friend.id, false);
    } else {
      this.setState({
        checked: true,
        btnText: friend.first_name + " " + friend.last_name + " (Selected)",
      });
      this.props.callBack(friend.id, true);
    }
  }

  componentDidMount() {
    const { friend } = this.props;
    this.setState({ btnText: friend.first_name + " " + friend.last_name });
  }

  render() {
    const { checked, btnText } = this.state;
    const { friend } = this.props;
    return (
      <ToggleButton
        className="set-event-friendBtn"
        type="checkbox"
        id={friend.id}
        size="lg"
        variant="outline-dark"
        checked={checked}
        onChange={this.handleChange}
      >
        {btnText}
      </ToggleButton>
    );
  }
}

export default FriendBtn;
