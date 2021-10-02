import React, { Component } from "react";
import "./emailVerify.css";
import fireworks from "react-fireworks";
import TweenOne from "rc-tween-one";
import "animate.css";
import { API_URL } from "../../constant";
import axios from "axios";

class EmailVerify extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.increase = false;

    this.state = {
      opacity: 0.9,
      background: "div-verify-background",
      waiting: false,
      paused: true,
      click: true,
      welcome: false,
    };

    this.startFlash = this.startFlash.bind(this);
    this.endFlash = this.endFlash.bind(this);
    this.verifiedAnimation = this.verifiedAnimation.bind(this);
    this.verify = this.verify.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.timer !== null) {
      clearInterval(this.timer);
    }
  }

  endFlash() {
    if (this.timer !== null) {
      clearInterval(this.timer);
    }
  }

  startFlash() {
    this.timer = setInterval(() => {
      var { opacity } = this.state;
      if (this.increase) {
        opacity += 0.0035;
      } else {
        opacity -= 0.0035;
      }
      if (opacity > 0.99) {
        this.increase = false;
      }
      if (opacity <= 0.7) {
        this.increase = true;
      }
      this.setState({ opacity });
    }, 10);
  }

  verifiedAnimation() {
    this.setState({ paused: false, opacity: 1 });
    fireworks.init("root", {
      explode_particles_resistance: 8,
    });
    fireworks.start();
    setTimeout(() => {
      this.setState({ welcome: true });
      fireworks.stop();
      setTimeout(() => {
        this.props.history.push("/login");
        window.location.reload();
      }, 5000);
    }, 5000);
  }

  async verify() {
    this.setState({ click: false });
    this.startFlash();
    const response = await axios
      .get(API_URL + this.props.match.url)
      .catch((error) => {
        alert(error.message);
        this.endFlash();
      });
    if (response && response.data) {
      this.endFlash();
      if (response.data === "Signup confirm success.") {
        this.setState({ waiting: true });
        this.verifiedAnimation();
      } else {
        this.setState({ click: true });
        alert(response.data);
      }
    }
  }

  render() {
    const { waiting, background, opacity, paused, click, welcome } = this.state;
    return (
      <div className={background}>
        {!waiting && (
          <p className="p-click-instruction">Click Here to Verify ➜</p>
        )}
        <TweenOne
          animation={{ scale: 100, duration: 5000 }}
          paused={paused}
          style={{ opacity: opacity }}
          className="div-animate-circle"
        />
        {click && <button className="btn-verify" onClick={this.verify} />}
        {welcome && (
          <p className="p-welcome animate__animated animate__bounceIn">
            Welcome
          </p>
        )}
      </div>
    );
  }
}

export default EmailVerify;
