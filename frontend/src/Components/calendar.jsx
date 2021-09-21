import React, { Component } from "react";
import {Inject, Day, Week, WorkWeek, Month, Agenda, ScheduleComponent} from "@syncfusion/ej2-react-schedule";

class Calendar extends Component {
  render(){
    return (
      <ScheduleComponent currentView='Week'>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]}/>
      </ScheduleComponent>
    );
  }
}
export default Calendar;