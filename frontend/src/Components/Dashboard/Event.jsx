import React from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import ReactTooltip from "react-tooltip";

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: "",
      endTime: "",
      hostId: "",
      hostInfo: "",
      title: "",
      timeColor: "green",
      displayHost: true
    }
  }

  componentDidMount() {
    
    const { startTime, endTime, host, title, userId} = this.props;
    if (host === userId) {
      this.setState({ displayHost: false });
    } else {
      this.setState({ displayHost: true });
    }
    this.setState( {hostId: host, title: title});
    var startTimeMinsInterval = "";
    var endTimeMinsInterval = "";
    var startTimeHourInterval = "";
    var endTimeHourInterval = "";
    // a.m. or p.m.
    var startTimeEndString = "";
    var endTimeEndString = "";

    var startTimeArray = startTime.toDateString().split(" ");
    var endTimeArray = endTime.toDateString().split(" ");
    // add a zero if minutes is less than 10
    if (startTime.getMinutes() < 10) {
      startTimeMinsInterval = ":0";
    } else {
      startTimeMinsInterval = ":";
    }
    // add a zero if minutes is less than 10
    if (endTime.getMinutes() < 10) {
      endTimeMinsInterval = ":0";
    } else {
      endTimeMinsInterval = ":";
    }
    // add a zero if hour is less than 10
    if (startTime.getHours() < 10) {
      startTimeHourInterval = "0";
    } else {
      startTimeHourInterval = "";
    }
    if (endTime.getHours() < 10) {
      endTimeHourInterval = "0";
    } else {
      endTimeHourInterval = "";
    }
    // set am or pm
    if (startTime.getHours() < 12) {
      startTimeEndString = " AM";
    } else {
      startTimeEndString = " PM";
    }
    if (endTime.getHours() < 12) {
      endTimeEndString = " AM";
    } else {
      endTimeEndString = " PM";
    }
    var startTimeString =
      startTimeArray[2] +
      " " +
      startTimeArray[1] +
      " " +
      startTimeArray[3] +
      "\xa0\xa0" +
      startTimeHourInterval +
      startTime.getHours() +
      startTimeMinsInterval +
      startTime.getMinutes() +
      startTimeEndString;

    var endTimeString =
      endTimeArray[2] +
      " " +
      endTimeArray[1] +
      " " +
      endTimeArray[3] +
      "\xa0\xa0" +
      endTimeHourInterval +
      endTime.getHours() +
      endTimeMinsInterval +
      endTime.getMinutes() +
      endTimeEndString;
    this.setState({
      startTime: startTimeString,
      endTime: endTimeString,
    });

  }

  // // get the host information
  // async getHostInfo(id) {
  //   const response = await axios.post(
  //     API_URL + "/user",
  //     { id: id },
  //     {
  //       headers: {
  //         Authorization: "Bearer " + this.state.basic.token,
  //       },
  //     }
  //   );
  //   if (response.data) {
  //     this.setState({hostInfo:response.data})
  //   }
  // }

  render() {
    const { startTime, endTime, title, timeColor } = this.state;
    const { notes } = this.props;
    console.log(notes);
    return (
      <div 
        className="event"
        data-tip={notes}
      >
        <div className="child-event">
        <i className="fa fa-clock-o fa-lg"
         style={{ color: timeColor, marginRight: 10}}
        />
        {startTime} - {endTime}
        <br />
        {title}
        </div>
        
        {notes ? (
          <ReactTooltip place="right" type="info" html={true} />
        ) : (<></>)}
      </div>
    )
  }

}

export default Event;