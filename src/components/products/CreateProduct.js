import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import SelectBrands from '../brands/SelectBrands';
import SelectNicotineRates from '../nicotineRates/SelectNicotineRates';
import SelectCategories from '../categories/SelectCategory';

import { ListAllProductsQuery } from './ListProduct';

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
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
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
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

class CreateProduct extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            brandId: '',
            nicotineRatesId: '',
            categoriesIds: [],
            available: false,
            file: null,
        };

        this.handlePost = this.handlePost.bind(this);
    }

    async uploadFile() {
        const { file } = this.state;
        const data = new FormData();
        data.append('data', file);

        return axios.post('https://api.graph.cool/file/v1/cj57vba1nl6ia0181m1vbe5cr', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
    }

    render() {
        return (
            <div className='w-100 pa4 flex justify-center'>
                <div style={{ maxWidth: 400 }} className=''>
                    <input
                        className='w-100 pa3 mv2'
                        value={this.state.name}
                        placeholder='Name'
                        onChange={(e) => this.setState({ name: e.target.value })}
                    />
                    <span>Product available:</span>
                    <input
                        type="checkbox"
                        className='w-100 pa3 mv2'
                        value={this.state.available}
                        placeholder='Available'
                        onChange={(e) => this.setState({ available: e.target.checked })}
                    />
                    <SelectCategories onSelectedValue={({ value }) => this.setState({ categoriesIds: [value] })}/>
                    <SelectBrands onSelectedValue={({ value }) => this.setState({ brandId: value })}/>
                    <SelectNicotineRates onSelectedValue={({ value }) => this.setState({ nicotineRatesId: value })}/>
                    <ImageUpload onImageSelected={({ file }) => {
                        this.setState({ file });
                    }}
                    />
                    { this.state.name && <button className='pa3 bg-black-10 bn dim ttu pointer'
                                                 onClick={this.handlePost}> Add product </button>
                    }
                </div>
            </div>
        );
    }

    async handlePost() {
        const { name, available, brandId, nicotineRatesId, categoriesIds } = this.state;

        try {
            const { data: { url } } = await this.uploadFile();

            await this.props.addProduct({
                name,
                available,
                imageUrl: url,
                brandId,
                nicotineRatesId,
                categoriesIds
            });
            this.props.history.push('/Produits/list');
        } catch (e) {
            //TODO: Handle error (could not add product)
            console.log(e);
        }
    }
}

const addProduct = gql`
    mutation createProduct(
    $name: String!,
    $available: Boolean,
    $imageUrl: String!,
    $brandId: ID,
    $nicotineRatesId: ID,
    $categoriesIds: [ID!],
    ) {
        createProduct(
            name: $name,
            available: $available,
            imageUrl: $imageUrl,
            brandId: $brandId,
            nicotineRatesId: $nicotineRatesId,
            categoriesIds: $categoriesIds
        ) {
            id
        }
    }`;

const CreateProductWithMutation = graphql(addProduct, {
    props: ({ mutate }) => ({
        addProduct: ({ name, available, imageUrl, brandId, nicotineRatesId, categoriesIds }) =>
            mutate({
                variables: { name, available, imageUrl, brandId, nicotineRatesId, categoriesIds },
                refetchQueries: [{
                    query: ListAllProductsQuery
                }],
            }),
    }),
})(CreateProduct);

export default withRouter(CreateProductWithMutation);