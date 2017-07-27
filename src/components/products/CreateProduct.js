import React, { Component } from 'react';
import proptypes from 'prop-types';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Select from 'react-select';
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

    handleTaxonProductTaxons(taxon) {
        this.setState({
            taxonsIds: this.state.taxonsIds,
            taxon: !taxon.available });
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

        // Options pour le select à multiples choix
        const taxons = allTaxons.map((taxon) => ({ label: taxon.name, value: taxon.id, available: true }));
        const brands = allBrands.map((brand) => ({ label: brand.name, value: brand.id}));
        const categories = allCategories.map((categorie) => ({ label: categorie.name, value: categorie.id}));

        return (
            <div className="Createproduct-container">
                <label className="Createproduct-label">Nom
                    <input
                        className="Createproduct-input"
                        value={this.state.name}
                        placeholder='...'
                        onChange={(e) => this.setState({ name: e.target.value })}
                    />
                </label>
                <label className="Createproduct-label"> Marque
                    <Select
                       placeholder='...'
                       value={this.state.brandId}
                       options={brands}
                       clearable={false}
                       onChange={(target) => this.setState({ brandId: target.value})}
                    />
                </label>
                <label className="Createproduct-label">Taxons
                    <Select
                       placeholder='...'
                       multi
                       value={this.state.taxonsIds}
                       options={taxons}
                       onChange={(targets) => this.setState({ taxonsIds: targets.map((target) => target)})}
                    />
                </label>
                {
                    this.state.taxonsIds.length > 0 && (
                        <div className="Createproduct-switch-container">
                            <label className="Createproduct-label">Disponibilitées<br />
                            { 
                                this.state.taxonsIds.map((taxon, k) => (
                                    <span 
                                        onClick={() => this.handleTaxonProductTaxons(taxon)}
                                        className="Createproduct-switch" 
                                        style={{backgroundColor: taxon.available ? '#1abc9c' : '#D3746A'}}
                                        key={k}>{taxon.label}
                                    </span>
                                ))
                            }
                            </label>
                        </div>
                    )
                }
                <label className="Createproduct-label">Catégorie
                    <Select
                       placeholder='...'
                       multi
                       value={this.state.categoriesIds}
                       options={categories}
                       clearable={false}
                       onChange={(targets) => this.setState({ categoriesIds: targets.map((target) => target.value)})}
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
        this.props.closeModal();
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
                categoriesIds: categoriesIds.length > 0 ? categoriesIds : allCategories[0].id,
            });

            await taxonsIds.forEach(async (taxonId) => (
                await this.props.addProductTaxons({ taxonId: taxonId.value, productId, available: taxonId.available })
            ));
            this.setState(this.initialState);
            this.props.history.push('/Produits');
        } catch (e) {
            //TODO: Handle error (could not add product)
            console.log(e);
        }
    }
}

CreateProduct.proptypes = {
    closeModal: proptypes.func,
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
            name
            categories { name }
            brand { name }
            imageUrl
            productTaxons { available, taxon { name } }
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
                    categoriesIds,
                },
                update: (store, { data: { createProduct } }) => {
                    const data = store.readQuery({ query: ListAllProductsQuery });

                    data.allProducts.push(createProduct);
                    store.writeQuery({ query: ListAllProductsQuery, data });
                },
            }),
    }),
};

const CreateProductTaxonsMutation = gql`
    mutation createProductTaxons(
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
            available
            taxon { name }
            product { id, name }
        }
    }`;

const CreateProductTaxonsMutationOptions = {
    props: ({ mutate }) => ({
        addProductTaxons: ({ productId, taxonId, available }) =>
            mutate({
                variables: {
                    productId,
                    taxonId,
                    available,
                },
                update: (store, { data: { createProductTaxons } }) => {
                    const data = store.readQuery({ query: ListAllProductsQuery });

                    data.allProducts = data.allProducts.map((product) => {
                        if (product.id === productId) {
                            return {
                                ...product,
                                productTaxons: [...product.productTaxons, createProductTaxons],
                            }
                        }
                        return product;
                    });

                    store.writeQuery({ query: ListAllProductsQuery, data});
                }
            })
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
    graphql(CreateProductTaxonsMutation, CreateProductTaxonsMutationOptions),
    graphql(CreateProductMutation, CreateProductMutationOptions),
    graphql(AllDetailsQuery),
)(CreateProduct);

export default withRouter(CreateProductWithMutationAndQueries);