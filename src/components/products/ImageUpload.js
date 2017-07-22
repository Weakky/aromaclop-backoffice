import React from 'react';

import './styles/imageupload.css';

export default class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imagePreviewUrl: '',
        };
    }

    _handleImageChange(e) {
        e.preventDefault();

        if (!e.target.files.length) {
            this.setState({ imagePreviewUrl: '' });
            return;
        }

        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onloadend = () => {
            this.props.onImageSelected({
                file: file,
                imagePreviewUrl: reader.result,
            });
            this.setState({ imagePreviewUrl: reader.result });
        };

        reader.readAsDataURL(file)
    }

    render() {
        const { imagePreviewUrl } = this.state;
        const imagePreview = imagePreviewUrl
            ? ( <img style={{ margin: 20, height: 100, width: 100}} src={imagePreviewUrl}/> )
            : ( <div className="Imageupload-previewText">Prévisualisation de l'image..</div> );

        return (
            <div className="previewComponent">
                <label className="Imageupload-label">Image du produit
                    <input
                       type="file"
                       onChange={(e)=>this._handleImageChange(e)}
                    />
                </label>
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