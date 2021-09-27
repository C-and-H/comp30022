import React, { Component } from "react";
import { createPortal } from "react-dom";
import Button from "react-bootstrap/Button";

class VideoCall extends Component {
  constructor(props) {
    super(props);

    const doc = window.document;
    this.node = doc.createElement("div");
    doc.body.appendChild(this.node);

    this.state = {
      visible: this.props.visible,
    };

    this.success = this.success.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentDidUpdate() {
    if (this.props.visible !== this.state.visible) {
      if (this.props.visible) {
        this.getUserMedia(
          {
            audio: true,
            video: { facingMode: "user" },
          },
          this.success,
          this.error
        );
      }
      this.setState({ visible: this.props.visible });
    }
  }

  componentWillUnmount() {
    if (this.node) {
      window.document.body.removeChild(this.node);
    }
  }

  getUserMedia(constraints, success, error) {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(success)
        .catch(error);
    } else if (navigator.webkitGetUserMedia) {
      navigator.webkitGetUserMedia(constraints, success, error);
    } else if (navigator.mozGetUserMedia) {
      navigator.mozGetUserMedia(constraints, success, error);
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia(constraints, success, error);
    }
  }

  success(stream) {
    let video = document.getElementById("myVideo");
    this.props.onStream(stream);
    if ("srcObject" in video) {
      video.srcObject = stream;
    } else {
      let CompatiableURL = window.URL || window.webkitURL;
      video.src = CompatiableURL.createObjectURL(stream);
    }
  }

  error(error) {
    console.log("Fail to get media device", error);
  }

  myVideo() {
    return (
      <video
        id="myVideo"
        playsInline
        muted
        autoPlay
        className="video-call-video"
      />
    );
  }

  render() {
    return createPortal(
      this.state.visible && (
        <div className="div-video-call">
          <div className="div-video-title">Video Chat</div>
          {this.myVideo()}
          <Button
            onClick={() => {
              let video = document.getElementById("myVideo");
              this.props.onStream(null);
              video.srcObject.getTracks().forEach((track) => {
                track.stop();
              });
              video.srcObject = null;
              this.props.endCall();
            }}
          />
        </div>
      ),
      this.node
    );
  }
}

export default VideoCall;
