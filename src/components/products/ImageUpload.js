import React from 'react';

export default class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imagePreviewUrl: '',
        };
    }

    _handleImageChange(e) {
        e.preventDefault();

        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onloadend = () => {
            this.props.onImageSelected({
                file: file,
                imagePreviewUrl: reader.result
            });
            this.setState({ imagePreviewUrl: reader.result });
        };

        reader.readAsDataURL(file)
    }

    render() {
        const { imagePreviewUrl } = this.state;
        const imagePreview = imagePreviewUrl
            ? ( <img src={imagePreviewUrl}/> )
            : ( <div className="previewText">Please select an Image for Preview</div> );

        return (
            <div className="previewComponent">
                <input className="fileInput"
                       type="file"
                       onChange={(e)=>this._handleImageChange(e)} />
                <div className="imgPreview">
                    {imagePreview}
                </div>
            </div>
        )
    }
}

ImageUpload.propTypes = {
    onImageSelected: React.PropTypes.func,
};