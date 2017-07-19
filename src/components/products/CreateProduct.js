import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';

import SelectDetails from './SelectDetails';
import ImageUpload from './ImageUpload';

import { ListAllProductsQuery } from './ListProduct';

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
        const { data: {
            allBrands,
            allNicotineRateses: allNicotineRates,
            allCategories
        } } = this.props;


        if (this.props.data.loading) {
            return <div>Loading...</div>
        }

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
                    <SelectDetails label="Select brand:"
                                   data={allBrands}
                                   onSelectedValue={({ value }) => this.setState({ brandId: value })}
                    />
                    <SelectDetails label="Select nicotine rates:"
                                   data={allNicotineRates}
                                   onSelectedValue={({ value }) => this.setState({ nicotineRatesId: value })}
                    />
                    <SelectDetails label="Select category:"
                                   data={allCategories}
                                   onSelectedValue={({ value }) => this.setState({ categoriesIds: [value] })}
                    />
                    <ImageUpload onImageSelected={({ file }) => this.setState({ file })} />
                    { this.state.name && this.state.file &&
                    <button className='pa3 bg-black-10 bn dim ttu pointer'
                            onClick={this.handlePost}> Add product
                    </button>
                    }
                </div>
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
            this.props.history.push('/Produits/list');
        } catch (e) {
            //TODO: Handle error (could not add product)
            console.log(e);
        }
    }
}

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