import React from "react";
import ReactDOM from "react-dom/client";
import AudioPlayer from "./App.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return React.createElement("div", { style: { padding: 40, color: "#ff3b39", background: "#060606", fontFamily: "monospace", fontSize: 14, whiteSpace: "pre-wrap", height: "100vh" } },
        "Something went wrong:\n\n" + this.state.error.toString() + "\n\n" + (this.state.error.stack || "")
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(ErrorBoundary, null,
    React.createElement(AudioPlayer)
  )
);
