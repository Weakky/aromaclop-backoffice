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
        taxonsIds: [],
        categoriesIds: [],
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
            allTaxons,
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
                       data={allTaxons}
                       onSelectedValue={({ value }) => this.setState({ taxonsIds: [...this.state.taxonsIds, value] })}
                    />
                </label>
                <label className="Createproduct-label">Catégorie
                    <SelectDetails
                       data={allCategories}
                       onSelectedValue={({ value }) => this.setState({ categoriesIds: [value] })}
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
        const { name, brandId, taxonsIds, categoriesIds } = this.state;
        const { data: {
            allBrands,
            allCategories,
        }} = this.props;

        try {
            const { data: { url } } = await this.uploadFile();

            const {
                data: {
                    createProduct: { id: productId }
                }
            } = await this.props.addProduct({
                name,
                imageUrl: url,
                brandId: brandId ? brandId : allBrands[0].id,
                categoriesIds: categoriesIds.length ? categoriesIds : allCategories[0].id,
            });

            await taxonsIds.forEach(async (taxonId) => (
                await this.props.addAvailability({ taxonId, productId, available: true })
            ));

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
    $imageUrl: String!,
    $brandId: ID,
    $categoriesIds: [ID!],
    ) {
        createProduct(
            name: $name,
            imageUrl: $imageUrl,
            brandId: $brandId,
            categoriesIds: $categoriesIds,
        ) {
            id
        }
    }`;

const CreateProductMutationOptions = {
    props: ({ mutate }) => ({
        addProduct: ({ name, imageUrl, brandId, categoriesIds }) =>
            mutate({
                variables: {
                    name,
                    imageUrl,
                    brandId,
                    categoriesIds
                },
                refetchQueries: [{ query: ListAllProductsQuery }],
            }),
    }),
};

const CreateAvailabilityMutation = gql`
    mutation createAvailability(
    $productId: ID
    $taxonId: ID
    $available: Boolean!
    ) {
        createProductTaxons(
            productId: $productId
            taxonId: $taxonId
            available: $available
        ) {
            id
        }
    }`;

const CreateAvailabilityMutationOptions = {
    props: ({ mutate }) => ({
        addAvailability: ({ productId, taxonId, available }) =>
            mutate({
                variables: {
                    productId,
                    taxonId,
                    available
                }
            }),
    }),
};

const AllDetailsQuery = gql`query allDetailsQuery {
    allTaxons {
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
    graphql(CreateAvailabilityMutation, CreateAvailabilityMutationOptions),
    graphql(CreateProductMutation, CreateProductMutationOptions),
    graphql(AllDetailsQuery),
)(CreateProduct);

export default withRouter(CreateProductWithMutationAndQueries);