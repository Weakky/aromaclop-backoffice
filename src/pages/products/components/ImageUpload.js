import React from "react";
import proptypes from "prop-types";
import { TiUpload } from "react-icons/lib/ti"

import "../styles/imageupload.css";

export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imagePreviewUrl: props.imagePreviewUrl
    };
  }

  _handleImageChange(e) {
    e.preventDefault();

    if (!e.target.files.length) {
      this.setState({ imagePreviewUrl: "" });
      return;
    }

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      this.props.onImageSelected({
        file: file,
        imagePreviewUrl: reader.result
      });
      this.setState({ imagePreviewUrl: reader.result });
    };

    reader.readAsDataURL(file);
  }

  render() {
    const { imagePreviewUrl } = this.state;
    const imagePreview = imagePreviewUrl && (
      <img
        alt="preview"
        style={{ height: 80, width: 80 }}
        src={imagePreviewUrl}
      />
    );

    return (
      <div className="Imageupload-container">
	      {
	        imagePreview ?
            <div className="imgPreview">{imagePreview}</div>
            :
		        <label className="Imageupload-label-file">
              <TiUpload size={36} className="Imageupload-icon" />
            <input id="input-file" type="file" onChange={e => this._handleImageChange(e)}/>
          </label>
	      }
      </div>
    );
  }
}

ImageUpload.proptypes = {
  onImageSelected: proptypes.func,
  imagePreviewUrl: proptypes.string
};

ImageUpload.defaultProps = {
  imagePreviewUrl: ""
};
