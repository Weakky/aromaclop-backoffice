import React from "react";
import proptypes from "prop-types";
import { GoPlus, GoDash } from "react-icons/lib/go";

import "./styles/resume.css";

const Resume = props => {
  return (
    <div>
      {props.data.available ? (
        <div
          style={{ backgroundColor: "rgba(26, 188, 156, 0.1)" }}
          className="Resume-container"
        >
          <GoPlus style={{ marginLeft: 10, color: "rgba(26, 188, 156, 1)" }} />
          <p className="Resume-name">{props.data.productName}</p>
          <p className="Resume-message">
            Ce produit est maintenant disponible en{" "}
            <span style={{ fontWeight: "bold" }}>{props.data.name}</span>
          </p>
        </div>
      ) : (
        <div
          style={{ backgroundColor: "rgba(204, 97, 85, 0.1)" }}
          className="Resume-container"
        >
          <GoDash style={{ marginLeft: 10, color: "rgba(204, 97, 85, 1)" }} />
          <p className="Resume-name">{props.data.productName}</p>
          <p className="Resume-message">
            Ce produit n'est plus disponible en{" "}
            <span style={{ fontWeight: "bold" }}>{props.data.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

Resume.proptypes = {
  data: proptypes.object.isRequired
};

export default Resume;
