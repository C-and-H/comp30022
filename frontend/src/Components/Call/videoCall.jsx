import React, { Component } from "react";
import { createPortal } from "react-dom";
import Button from "react-bootstrap/Button";
import { BallSpinClockWise } from "react-pretty-loading";
import "./videoCall.css";
import Slide from "react-reveal/Slide";

class VideoCall extends Component {
  constructor(props) {
    super(props);

    const doc = window.document;
    this.node = doc.createElement("div");
    doc.body.appendChild(this.node);

    this.state = {
      visible: this.props.visible,
      myStream: null,
      friendVideo: this.props.friendVideo,
      peer: this.props.peer,
      videoOn: false,
      voiceOn: false,
      screenOn: false,
    };

    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.switchToVoiceStream = this.switchToVoiceStream.bind(this);
    this.switchToVideoStream = this.switchToVideoStream.bind(this);
    this.switchToScreenStream = this.switchToScreenStream.bind(this);
    this.removeCurrentStream = this.removeCurrentStream.bind(this);
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
          },
          this.success,
          this.error
        );
      }
      this.setState({ visible: this.props.visible });
    }

    if (this.props.friendVideo !== this.state.friendVideo) {
      if (this.state.visible) {
        let video = document.getElementById("friendVideo");
        if ("srcObject" in video) {
          video.srcObject = this.props.friendVideo;
        } else {
          let CompatiableURL = window.URL || window.webkitURL;
          video.src = CompatiableURL.createObjectURL(this.props.friendVideo);
        }
      }

      this.setState({ friendVideo: this.props.friendVideo });
    }

    if (this.props.peer !== this.state.peer) {
      this.setState({ peer: this.props.peer });
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
    this.setState({
      myStream: stream,
      videoOn: false,
      voiceOn: true,
      screenOn: false,
    });
  }

  switchToVideoStream() {
    try {
      this.getUserMedia(
        {
          audio: true,
          video: { facingMode: "user" },
        },
        (stream) => {
          this.props.onSwitch(stream);
          let video = document.getElementById("myVideo");
          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            let CompatiableURL = window.URL || window.webkitURL;
            video.src = CompatiableURL.createObjectURL(stream);
          }
          this.removeCurrentStream();
          this.state.peer.addStream(stream);
          this.setState({
            myStream: stream,
            videoOn: true,
            voiceOn: false,
            screenOn: false,
          });
        },
        (error) => {
          alert("Fail to get media device", error);
        }
      );
    } catch (error) {
      alert("Fail to switch media device", error);
    }
  }

  switchToVoiceStream() {
    try {
      this.getUserMedia(
        {
          audio: true,
        },
        (stream) => {
          this.props.onSwitch(stream);
          let video = document.getElementById("myVideo");
          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            let CompatiableURL = window.URL || window.webkitURL;
            video.src = CompatiableURL.createObjectURL(stream);
          }
          this.removeCurrentStream();
          this.state.peer.addStream(stream);
          this.setState({
            myStream: stream,
            videoOn: false,
            voiceOn: true,
            screenOn: false,
          });
        },
        (error) => {
          alert("Fail to get media device", error);
        }
      );
    } catch (error) {
      alert("Fail to switch media device", error);
    }
  }

  switchToScreenStream() {
    try {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({
            video: {
              cursor: "always",
            },
            audio: true,
          })
          .then((stream) => {
            this.props.onSwitch(stream);
            let video = document.getElementById("myVideo");
            if ("srcObject" in video) {
              video.srcObject = stream;
            } else {
              let CompatiableURL = window.URL || window.webkitURL;
              video.src = CompatiableURL.createObjectURL(stream);
            }
            this.removeCurrentStream();
            this.state.peer.addStream(stream);
            this.setState({
              myStream: stream,
              videoOn: false,
              voiceOn: false,
              screenOn: true,
            });
          });
      } else {
        alert("Fail to switch media device");
      }
    } catch (error) {
      alert("Fail to switch media device", error);
    }
  }

  removeCurrentStream() {
    const { myStream, peer } = this.state;
    peer.removeStream(myStream);
    try {
      myStream.getTracks().forEach((track) => {
        track.stop();
      });
    } catch (e) {}
  }

  error(error) {
    alert("Fail to get media device", error);
    this.props.endCall();
  }

  videoDisplay() {
    return (
      <div className="div-video-call-display">
        <div className="div-my-video">
          {this.props.myName && this.props.myName.name}
          <video
            id="myVideo"
            playsInline
            muted
            autoPlay
            className="video-call-video"
          />
        </div>
        <div className="div-friend-video">
          {this.props.friendName}
          <div className="div-loading-video">
            <BallSpinClockWise
              loading={this.state.friendVideo === null}
              center
            />
          </div>
          <video
            id="friendVideo"
            playsInline
            autoPlay
            className="video-call-video"
          />
        </div>
      </div>
    );
  }

  // hangUp() {
  //   this.state.myVideo.getTracks().forEach((track) => {
  //     track.stop();
  //   });
  //   this.props.endCall();
  // }

  render() {
    return createPortal(
      this.state.visible && (
        <Slide top>
          <div className="div-video-call">
            <div className="div-video-title">Video Call</div>
            {this.videoDisplay()}
            <div className="div-video-button">
              <Button
                disabled={this.state.voiceOn || this.state.friendVideo === null}
                onClick={this.switchToVoiceStream}
              >
                Voice only
              </Button>
              <Button
                disabled={this.state.videoOn || this.state.friendVideo === null}
                onClick={this.switchToVideoStream}
              >
                Video
              </Button>
              <Button
                disabled={
                  this.state.screenOn || this.state.friendVideo === null
                }
                onClick={this.switchToScreenStream}
              >
                Share screen
              </Button>
              <Button
                onClick={this.props.endCall}
                className="btn-end-call btn-outline-danger"
              >
                <i className="fa fa-phone-slash" />
              </Button>
            </div>
          </div>
        </Slide>
      ),
      this.node
    );
  }
}

export default VideoCall;
