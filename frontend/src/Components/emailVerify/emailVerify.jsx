import React, { Component } from "react";
import "./emailVerify.css";
import fireworks from "react-fireworks";
import TweenOne from "rc-tween-one";
import "animate.css";

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
        opacity += 0.0025;
      } else {
        opacity -= 0.0025;
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
        this.props.history.push("/");
        window.location.reload();
      }, 5000);
    }, 5000);
  }

  verify() {
    this.setState({ click: false });
    this.startFlash();
    setTimeout(() => {
      this.endFlash();
      this.setState({ waiting: true });
      this.verifiedAnimation();
    }, 2000);
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
