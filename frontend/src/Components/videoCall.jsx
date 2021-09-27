import React, { Component } from "react";
import { createPortal } from "react-dom";
import Button from "react-bootstrap/Button";
import { BallSpinClockWise } from "react-pretty-loading";

class VideoCall extends Component {
  constructor(props) {
    super(props);

    const doc = window.document;
    this.node = doc.createElement("div");
    doc.body.appendChild(this.node);

    this.state = {
      visible: this.props.visible,
      myVideo: null,
      friendVideo: this.props.friendVideo,
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

    if (this.props.friendVideo !== this.state.friendVideo) {
      let video = document.getElementById("friendVideo");
      if ("srcObject" in video) {
        video.srcObject = this.props.friendVideo;
      } else {
        let CompatiableURL = window.URL || window.webkitURL;
        video.src = CompatiableURL.createObjectURL(this.props.friendVideo);
      }
      this.setState({ friendVideo: this.props.friendVideo });
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
    this.setState({ myVideo: stream });
  }

  error(error) {
    console.log("Fail to get media device", error);
  }

  videoDisplay() {
    return (
      <div className="div-video-call-display">
        <div className="div-my-video">
          <video
            id="myVideo"
            playsInline
            muted
            autoPlay
            className="video-call-video"
          />
        </div>
        {this.state.friendVideo ? (
          <div className="div-friend-video">
            <video
              id="friendVideo"
              playsInline
              autoPlay
              className="video-call-video"
            />
          </div>
        ) : (
          <div className="div-loading-video">
            <BallSpinClockWise loading={true} center />
          </div>
        )}
      </div>
    );
  }

  hangUp() {
    this.props.onStream(null);
    this.state.myVideo.getTracks().forEach((track) => {
      track.stop();
    });
    this.props.endCall();
  }

  render() {
    return createPortal(
      this.state.visible && (
        <div className="div-video-call">
          <div className="div-video-title">Video Chat</div>
          {this.videoDisplay()}
          <div className="div-video-button">
            <Button onClick={() => this.hangUp()} className="btn-end-call">
              <i className="fa fa-phone-slash" />
            </Button>
          </div>
        </div>
      ),
      this.node
    );
  }
}

export default VideoCall;
