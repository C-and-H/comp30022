import React, { Component } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import logo from "./Logo.png";

class Loading extends Component {
  constructor(props) {
    super(props);

    const doc = window.document;
    this.node = doc.createElement("div");
    doc.body.appendChild(this.node);

    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    this.setState({ visible: this.props.visible });
  }

  componentDidUpdate() {
    if (this.props.visible !== this.state.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  render() {
    return createPortal(
      this.state.visible && (
        <div className="div-loading-background">
          <motion.div
            animate={{ rotate: -60 }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              repeatType: "reverse",
              duration: 1.1,
            }}
            className="animate-CandH-icon"
          >
            <img alt="logo" src={logo} className="img-CandH-icon" />
          </motion.div>
        </div>
      ),
      this.node
    );
  }
}

export default Loading;
