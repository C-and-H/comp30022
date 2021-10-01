import React, { Component } from "react";
import "./emailVerify.css";
import fireworks from "react-fireworks";
import TweenOne from "rc-tween-one";

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
    };

    this.startFlash = this.startFlash.bind(this);
    this.endFlash = this.endFlash.bind(this);
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
    fireworks.init("root", {});
    fireworks.start();
    setTimeout(() => {
      fireworks.stop();
    }, 5000);
  }

  render() {
    const { waiting, background, opacity, paused } = this.state;
    return (
      <div className={background}>
        {!waiting && (
          <p className="p-click-instruction">Click Here to Verify ➜</p>
        )}
        <TweenOne
          paused={paused}
          style={{ opacity: opacity }}
          className="div-animate-circle"
        />
        <button className="btn-verify" onClick={this.verifiedAnimation} />
      </div>
    );
  }
}

export default EmailVerify;
