import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';

import SelectDetails from './SelectDetails';
import ImageUpload from './ImageUpload';

import { ListAllProductsQuery } from './ListProduct';

import './styles/createproduct.css';
import 'react-select/dist/react-select.css';

class CreateProduct extends Component {

    initialState = {
        name: '',
        brandId: '',
        nicotineRatesId: '',
        categoriesIds: [],
        available: false,
        file: null,
    };

    constructor(props) {
        super(props);

        this.state = this.initialState;
        this.handlePost = this.handlePost.bind(this);
    };

    async uploadFile() {
        const { file } = this.state;
        const data = new FormData();

        data.append('data', file);

        return axios.post('https://api.graph.cool/file/v1/cj57vba1nl6ia0181m1vbe5cr', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    };

    render() {
        const { data: {
            allBrands,
            allNicotineRateses: allNicotineRates,
            allCategories
        } } = this.props;


        if (this.props.data.loading) {
            return <div>Loading...</div>
        }

        return (
            <div className="Createproduct-container">
                <label className="Createproduct-label">Nom
                    <input
                        className="Createproduct-input"
                        value={this.state.name}
                        placeholder='FR-6'
                        onChange={(e) => this.setState({ name: e.target.value })}
                    />
                </label>
                <label className="Createproduct-label"> Marque
                    <SelectDetails
                       className="Createproduct-select"
                       style={{width: 100}}
                       data={allBrands}
                       onSelectedValue={({ value }) => this.setState({ brandId: value })}
                    />
                </label>
                <label className="Createproduct-label">TN
                    <SelectDetails
                       data={allNicotineRates}
                       onSelectedValue={({ value }) => this.setState({ nicotineRatesId: value })}
                    />
                </label>
                <label className="Createproduct-label">Catégorie
                    <SelectDetails
                       data={allCategories}
                       onSelectedValue={({ value }) => this.setState({ categoriesIds: [value] })}
                    />
                </label>
                <label className="Createproduct-label">En stock<br/>
                    <input
                      type="checkbox"
                      value={this.state.available}
                      placeholder='Available'
                      onChange={(e) => this.setState({ available: e.target.checked })}
                    />
                </label>
                <ImageUpload onImageSelected={({ file }) => this.setState({ file })} />
                { this.state.name && this.state.file &&
                    <button
                        className="Createproduct-button"
                        onClick={this.handlePost}> Ajouter le produit
                    </button>
                }
            </div>
        );
    }

    async handlePost() {
        const { name, available, brandId, nicotineRatesId, categoriesIds } = this.state;
        const { data: {
            allBrands,
            allNicotineRateses: allNicotineRates,
            allCategories
        }} = this.props;

        try {
            const { data: { url } } = await this.uploadFile();

            await this.props.addProduct({
                name,
                available,
                imageUrl: url,
                brandId: brandId ? brandId : allBrands[0].id,
                nicotineRatesId: nicotineRatesId ? nicotineRatesId : allNicotineRates[0].id,
                categoriesIds: categoriesIds.length ? categoriesIds : allCategories[0].id,
            });
            this.setState(this.initialState);
            this.props.closeModal();
            this.props.history.push('/Produits');
        } catch (e) {
            //TODO: Handle error (could not add product)
            console.log(e);
        }
    }
}

CreateProduct.PropTypes = {
    closeModal: PropTypes.func,
};

const CreateProductMutation = gql`
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

const CreateProductMutationOptions = {
    props: ({ mutate }) => ({
        addProduct: ({ name, available, imageUrl, brandId, nicotineRatesId, categoriesIds }) =>
            mutate({
                variables: {
                    name,
                    available,
                    imageUrl,
                    brandId,
                    nicotineRatesId,
                    categoriesIds
                },
                refetchQueries: [{ query: ListAllProductsQuery }],
            }),
    }),
};

const AllDetailsQuery = gql`query allDetailsQuery {
    allNicotineRateses {
        id,
        name,
    },
    allBrands {
        id,
        name
    },
    allCategories {
        id,
        name
    }
}`;

const CreateProductWithMutationAndQueries = compose(
    graphql(CreateProductMutation, CreateProductMutationOptions),
    graphql(AllDetailsQuery),
)(CreateProduct);

export default withRouter(CreateProductWithMutationAndQueries);