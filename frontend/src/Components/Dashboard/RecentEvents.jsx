import React from "react";
import { API_URL } from "../../constant";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Button, Container, Row, Col, Label } from "reactstrap";
import "../../App.css";

class RecentEvents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
      appointments: null
    }
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
          hostId: data[i].hostId
        };
        appointments.push(appointment);
      }
    }
    this.setState({ appointments: appointments});
  }

  render() {
    const { appointments } = this.state;
    console.log(appointments);
    if (!appointments) return (<div></div>);
    return (
      <Container>
        
        {appointments.map((appointment) => (
          <Row key={appointment.id}>
            {appointment.title}
          </Row>
        ))}
      </Container>
    )
  }
}

export default RecentEvents;