import React, { Component, useState } from "react";
// import {Inject, Day, Week, WorkWeek, Month, Agenda, ScheduleComponent} from "@syncfusion/ej2-react-schedule";
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import CalendarSidebar from './CalendarSidebar';
import { Popover } from "reactstrap";
import { OverlayTrigger, Button } from "react-bootstrap";
import PopUpEvent from "./PopUpEvent"
import '../../App.css'
import {
  Scheduler,
  WeekView,
  Appointments,
  // AppointmentTooltip
} from '@devexpress/dx-react-scheduler-material-ui';
import Popup from "./Popup";

class Calendar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      seen: false,
      data: "",
    };
  }


  handleOnClick(event) {
    this.setState({
      data: event.data,
      seen: true
    });
  }
  //use arrow functions, 
  //as arrow functions point to parent scope and this will be available. 
  //(substitute of bind technique)
  setTrigger = () => {
    this.setState({seen: false});
  }

  Appointment = ({children, style, ...restProps}) => {
    return (
    <Appointments.Appointment 
      onClick={(event) =>
        this.handleOnClick(event)}
      {...restProps}
    >
      {children}
    </Appointments.Appointment>
    )
  }

  render(){
    const currentDate = '2018-07-17';
    const appointments = [
      {
        title: 'Website Re-Design Plan',
        startDate: new Date(2018, 6, 23, 9, 30),
        endDate: new Date(2018, 6, 23, 11, 30),
      }, {
        title: 'Book Flights to San Fran for Sales Trip',
        startDate: new Date(2018, 6, 23, 12, 0),
        endDate: new Date(2018, 6, 23, 13, 0),
      }, {
        title: 'Install New Router in Dev Room',
        startDate: new Date(2018, 6, 23, 14, 30),
        endDate: new Date(2018, 6, 23, 15, 30),
      }, {
        title: 'Approve Personal Computer Upgrade Plan',
        startDate: new Date(2018, 6, 24, 10, 0),
        endDate: new Date(2018, 6, 24, 11, 0),
      }, {
        title: 'Final Budget Review',
        startDate: new Date(2018, 6, 24, 12, 0),
        endDate: new Date(2018, 6, 24, 13, 35),
      }, {
        title: 'New Brochures',
        startDate: new Date(2018, 6, 24, 14, 30),
        endDate: new Date(2018, 6, 24, 15, 45),
      }, {
        title: 'Install New Database',
        startDate: new Date(2018, 6, 25, 9, 45),
        endDate: new Date(2018, 6, 25, 11, 15),
      }, {
        title: 'Approve New Online Marketing Strategy',
        startDate: new Date(2018, 6, 25, 12, 0),
        endDate: new Date(2018, 6, 25, 14, 0),
      },  {
        title: 'Brochure Design Review',
        startDate: new Date(2018, 6, 26, 14, 0),
        endDate: new Date(2018, 6, 26, 15, 30),
      }, {
        title: 'Create Icons for Website',
        startDate: new Date(2018, 6, 27, 10, 0),
        endDate: new Date(2018, 6, 27, 11, 30),
      }, {
        title: 'Upgrade Server Hardware',
        startDate: new Date(2018, 6, 27, 14, 30),
        endDate: new Date(2018, 6, 27, 16, 0),
      }, {
        title: 'Submit New Website Design',
        startDate: new Date(2018, 6, 27, 16, 30),
        endDate: new Date(2018, 6, 27, 18, 0),
      }, {
        title: 'Launch New Website',
        startDate: new Date(2018, 6, 26, 12, 20),
        endDate: new Date(2018, 6, 26, 14, 0),
      }, {
        title: 'Website Re-Design Plan',
        startDate: new Date(2018, 6, 16, 9, 30),
        endDate: new Date(2018, 6, 16, 15, 30),
      }, {
        title: 'Book Flights to San Fran for Sales Trip',
        startDate: new Date(2018, 6, 16, 12, 0),
        endDate: new Date(2018, 6, 16, 13, 0),
      }, {
        title: 'Install New Database',
        startDate: new Date(2018, 6, 17, 15, 45),
        endDate: new Date(2018, 6, 18, 12, 15),
      }, {
        title: 'Approve New Online Marketing Strategy',
        startDate: new Date(2018, 6, 18, 12, 35),
        endDate: new Date(2018, 6, 18, 14, 15),
      }, {
        title: 'Upgrade Personal Computers',
        startDate: new Date(2018, 6, 19, 15, 15),
        endDate: new Date(2018, 6, 20, 20, 30),
      }, {
        title: 'Prepare 2015 Marketing Plan',
        startDate: new Date(2018, 6, 20, 20, 0),
        endDate: new Date(2018, 6, 20, 13, 30),
      }, {
        title: 'Brochure Design Review',
        startDate: new Date(2018, 6, 20, 14, 10),
        endDate: new Date(2018, 6, 20, 15, 30),
      }, {
        title: 'Vacation',
        startDate: new Date(2018, 5, 22),
        endDate: new Date(2018, 6, 1),
      }, {
        title: 'Vacation',
        startDate: new Date(2018, 6, 28),
        endDate: new Date(2018, 7, 7),
      },
    ];
    
    return (
      
      <Paper>
        <Scheduler data={appointments}>
          <ViewState
            currentDate={currentDate}
          />
          <WeekView 
            startDayHour={9}
            endDayHour={21}
          />
          <Appointments
            appointmentComponent={this.Appointment}
          />
          <Popup trigger={this.state.seen} setTriggerBtn={this.setTrigger}>
            <h2>{this.state.data.title}</h2>
          </Popup>

          {/* <AppointmentTooltip/> */}
        </Scheduler>
      </Paper>
      // <ScheduleComponent currentView='Week'>
      //   <Inject services={[Day, Week, WorkWeek, Month, Agenda]}/>
      // </ScheduleComponent>
    );
  }
}
export default Calendar;