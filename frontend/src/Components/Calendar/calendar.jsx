import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import "./Popup.css";
import { API_URL } from "../../constant";
import AuthService from "../../Services/AuthService";
import { Redirect } from "react-router-dom";
import {
  Scheduler,
  WeekView,
  Appointments,
  DayView,
  MonthView,
  Toolbar,
  DateNavigator,
  TodayButton,
  CurrentTimeIndicator,
  // AppointmentTooltip
} from "@devexpress/dx-react-scheduler-material-ui";
import axios from "axios";
import Popup from "./PopUpWindow/Popup";
import Confirm from "./PopUpWindow/Confirm";
import AutoLinkText from "react-autolink-text2";
import DeleteSuccess from "./PopUpWindow/DeleteSuccess";

// handle the view switcher
const ExternalViewSwitcher = ({ currentViewName, onChange }) => (
  <RadioGroup
    aria-label="Views"
    style={{ flexDirection: "row" }}
    name="views"
    value={currentViewName}
    onChange={onChange}
  >
    <FormControlLabel value="Day" control={<Radio />} label="Day" />
    <FormControlLabel value="Week" control={<Radio />} label="Week" />
    <FormControlLabel value="Month" control={<Radio />} label="Month" />
  </RadioGroup>
);

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: localStorage.getItem("user"),
      basic: AuthService.getBasicInfo(),
      onClickDelete: false,
      seen: false,
      deleteSuccessPopUp: false,
      startTime: "",
      endTime: "",
      data: "",
      currentViewName: "Week",
      chosenId: "",
      appointments: [],
      participantInfos: [],
      participantNames: [],
      participantEmail: [],
      hostId: "",
      hostInfo: "",
      loading: false,
    };
    this.deleteEvent = this.deleteEvent.bind(this);
    this.currentViewNameChange = (e) => {
      this.setState({ currentViewName: e.target.value });
    };
    this.fetchAppointments = this.fetchAppointments.bind(this);
    this.getParticipantInfo = this.getParticipantInfo.bind(this);
    this.getHostInfo = this.getHostInfo.bind(this);
  }

  // if current user is null, will go back to homepage
  async componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    // if not login
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true });
    // get appointments from backend
    let data = await this.fetchAppointments();
    // console.log(data)
    let appointments = [];
    for (var i = 0; i < data.length; i++) {
      var appointment = {
        startDate: new Date(data[i].startTime),
        endDate: new Date(data[i].endTime),
        title: data[i].title,
        participantIds: data[i].participantIds,
        description: data[i].notes,
        id: data[i].id,
        hostId: data[i].hostId,
      };
      appointments.push(appointment);
    }
    this.setState({ appointments: appointments });
  }

  // fetch appointments from backend
  async fetchAppointments() {
    const user = AuthService.getBasicInfo();
    if (user && user.token) {
      const token = user.token;
      const response = await axios.get(API_URL + "/meeting/listMeeting", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      return response.data;
    } else {
      return "Current user was not found. Please log in ";
    }
  }

  // get the participant information
  async getParticipantInfo(id) {
    const response = await axios.post(
      API_URL + "/user",
      { id: id },
      {
        headers: {
          Authorization: "Bearer " + this.state.basic.token,
        },
      }
    );
    if (response.data) {
      let participantInfos = [...this.state.participantInfos];
      participantInfos.push(response.data);
      this.setState({ participantInfos });
    } else {
      return "Current user was not found. Please log in ";
    }
  }

  // get the host information
  async getHostInfo(id) {
    const response = await axios.post(
      API_URL + "/user",
      { id: id },
      {
        headers: {
          Authorization: "Bearer " + this.state.basic.token,
        },
      }
    );
    if (response.data) {
      this.setState({ hostInfo: response.data });
    } else {
      return "Current user was not found. Please log in ";
    }
  }

  async handleOnClick(event) {
    this.setState({ participantInfos: [] });
    for (var i = 0; i < event.data.participantIds.length; i++) {
      await this.getParticipantInfo(event.data.participantIds[i]);
    }

    await this.getHostInfo(event.data.hostId);
    var startTime = event.data.startDate;
    var endTime = event.data.endDate;
    const id = event.data.id;
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
      data: event.data,
      chosenId: id,
      seen: true,
    });
    this.setState({ loading: true });
  }
  //use arrow functions,
  //as arrow functions point to parent scope and this will be available.
  //(substitute of bind technique)
  setTriggerClose = () => {
    this.setState({ seen: false });
  };

  clickDismiss = () => {
    this.setState({
      onClickDelete: false,
      seen: false,
    });
  };

  dismissSuccessPopUp = () => {
    this.setState({
      deleteSuccessPopUp: false,
    });
    window.location.reload();
  };

  activateDelete = () => {
    this.setState({
      onClickDelete: true,
    });
  };

  handleOnClickCalendar(event) {
    // console.log("do nothing")
  }

  disableShow = ({ children, style, ...restProps }) => {
    return (
      <DateNavigator.OpenButton
        onClick={(event) => this.handleOnClickCalendar(event)}
        {...restProps}
      >
        {children}
      </DateNavigator.OpenButton>
    );
  };
  appointment = ({ children, style, ...restProps }) => {
    return (
      <Appointments.Appointment
        onClick={(event) => this.handleOnClick(event)}
        {...restProps}
      >
        {children}
      </Appointments.Appointment>
    );
  };

  clickAddEvent = () => {
    const redirect = "/setEvent";
    this.setState({ redirect });
  };

  async deleteEvent() {
    this.setState({
      onClickDelete: false,
      seen: false,
    });

    const { chosenId, basic } = this.state;

    const response = await axios.post(
      API_URL + "/meeting/deleteMeeting",
      {
        id: chosenId,
      },
      {
        headers: {
          Authorization: "Bearer " + basic.token,
        },
      }
    );
    if (response.data !== "Meeting not found.") {
      this.setState({ deleteSuccessPopUp: true });
    } else {
      alert(response.data);
    }
  }

  setButton = ({ children, style, ...restProps }) => {
    return (
      <Toolbar.FlexibleSpace>
        <a
          className="MuiButtonBase-root MuiButton-root calendar-btn"
          href="/setEvent"
        >
          <span className="MuiButton-label">Add Event</span>
        </a>
        {children}
      </Toolbar.FlexibleSpace>
    );
  };

  // display the participants
  displayParticipants = () => {
    const { participantInfos } = this.state;
    var participants = [];
    var participants_string = "";
    for (var i = 0; i < participantInfos.length; i++) {
      var name =
        participantInfos[i].first_name + " " + participantInfos[i].last_name;
      participants.push(name);
      participants_string = participants_string + name + ", ";
    }

    return (
      <div>
        {participants.length ? <p> {participants_string.slice(0, -2)}</p> : ""}
      </div>
    );
  };

  //display the host name
  displayHost = () => {
    return (
      <div>
        {this.state.hostInfo.first_name} {this.state.hostInfo.last_name}
      </div>
    );
  };

  render() {
    // if redict is not null imply user is not login, then go to home page
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    const { currentViewName } = this.state;
    const currentDate = new Date();
    const appointments = this.state.appointments;
    return (
      <React.Fragment>
        <ExternalViewSwitcher
          currentViewName={currentViewName}
          onChange={this.currentViewNameChange}
        />
        <div className="calendar">
          <Paper>
            <Scheduler data={appointments}>
              <ViewState
                defaultCurrentDate={currentDate}
                currentViewName={currentViewName}
              />
              <DayView />
              <MonthView />
              <WeekView startDayHour={1} endDayHour={24} />
              <Toolbar flexibleSpaceComponent={this.setButton} />
              <DateNavigator openButtonComponent={this.disableShow} />
              <TodayButton />
              <Appointments appointmentComponent={this.appointment} />
              <CurrentTimeIndicator />
            </Scheduler>
            <Popup
              trigger={this.state.seen}
              activateDelete={this.activateDelete}
              setTriggerClose={this.setTriggerClose}
            >
              <div>
                <h2 className="popup-header">Title: {this.state.data.title}</h2>
                <div className="show-time">
                  <p>
                    <span style={{ fontSize: 23, fontWeight: 600 }}>Time:</span>
                    <br />
                    {this.state.startTime} — {this.state.endTime}
                  </p>
                </div>
                <div className="description">
                  <span style={{ fontSize: 23, fontWeight: 600 }}>
                    Description:
                  </span>
                  <br />
                  <div
                    className="div-description"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    <AutoLinkText text={this.state.data.description} />
                  </div>
                </div>
                <div className="pop-host">
                  <span style={{ fontSize: 23, fontWeight: 600 }}>
                    Host Name:
                  </span>
                  {this.state.seen ? this.displayHost() : ""}
                </div>
                <div className="pop-paticipants">
                  <span style={{ fontSize: 23, fontWeight: 600 }}>
                    Participants: ({this.state.participantInfos.length} in
                    total)
                  </span>
                  {this.state.seen ? this.displayParticipants() : ""}
                </div>
              </div>
            </Popup>

            <Confirm
              triggerClickDelete={this.state.onClickDelete}
              clickDismiss={this.clickDismiss}
              deleteEvent={this.deleteEvent}
            >
              <h2 style={{ textAlign: "center", fontSize: 20 }}>
                Are you sure you want to delete this event?
              </h2>
            </Confirm>

            <DeleteSuccess
              trigger={this.state.deleteSuccessPopUp}
              dismissSuccessPopUp={this.dismissSuccessPopUp}
            >
              <h2
                style={{ textAlign: "center", fontSize: 20, paddingBottom: 15 }}
              >
                Delete event success.
              </h2>
            </DeleteSuccess>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}
export default Calendar;
