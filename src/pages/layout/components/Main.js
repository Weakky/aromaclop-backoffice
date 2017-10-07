import React from "react";

const Main = props => (
  <div
    style={{
      flex: 1,
      height: "100vh",
      overflow: "auto",
      backgroundColor: "#F9F9F9"
    }}
  >
    <div {...props} />
  </div>
);

export default Main;
