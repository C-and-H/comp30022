import React from "react";
import { API_URL } from "../../constant";
import axios from "axios";
import { Button } from "react-bootstrap";

import "./Dashboard.css";

import Event from "./event";

class RecentEvents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appointments: null,
    };
  }

  async componentDidMount() {
    await this.getEvents();
  }

  async getEvents() {
    const { basic } = this.props;
    const response = await axios.get(API_URL + "/meeting/recent", {
      headers: {
        Authorization: "Bearer " + basic.token,
      },
    });
    let appointments = [];
    if (response.data) {
      const data = response.data;

      for (var i = data.length - 1; i >= 0; i--) {
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
    }
    this.setState({ appointments: appointments });
  }

  

  render() {
    const { appointments } = this.state;
    const { basic } = this.props;

    
    return (
      <div className="events-box">
        <div className="event-header">
          <Button
            href="/calendar"
            variant="outline-success"
            className="calendar-button"
          >
            Calendar
          </Button>
        </div>
        <div >
        {appointments ? (
          appointments.length === 0 ? (
            <p className="no-meetings">
              No upcoming or past events around today, have a nice day !
            </p>
          ) : (
            appointments.map((appointment) => (
              <Event 
                key={appointment.id}
                host={appointment.hostId}
                title={appointment.title}
                startTime={appointment.startDate}
                endTime={appointment.endDate}
                userId ={basic.id}
                token={basic.token}
                notes={appointment.description}
              />
            
            ))
          )
        ) : (
          <></>
        )}
        {/* {appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Event 
              key={appointment.id}
              host={appointment.hostId}
              title={appointment.title}
              startTime={appointment.startDate}
              endTime={appointment.endDate}
              userId ={basic.id}
              token={basic.token}
              notes={appointment.description}
            />
          
          ))) : (
            <p className="no-meetings">
              No upcoming or past events around today, have a nice day !
            </p>
          )} */}
        </div>
      </div>
    );
  }
}

export default RecentEvents;
