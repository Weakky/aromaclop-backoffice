import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Product from './Product';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class ListProduct extends Component {

    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
    }

    async handleDelete(id) {
        await this.props.deleteProduct({ id });
        await this.props.data.refetch();
    }

    render() {

        if (this.props.data.loading) {
            return (<div>Chargement..</div>)
        }

        return (
            <div className='w-100 flex justify-center'>
                <Link to='/Produits/create'
                      className='fixed bg-white top-0 right-0 pa4 ttu dim black no-underline'>
                    + Nouveau produit
                </Link>
                <div className='w-100' style={{ maxWidth: 400 }}>
                    {this.props.data.allProducts.map((product) =>
                        <Product
                            key={product.id}
                            product={product}
                            handleDelete={() => this.handleDelete(product.id)}
                        />
                    )}
                </div>
            </div>
        )
    }
}

export const ListAllProductsQuery = gql`query allProducts {
    allProducts {
        id,
        name,
        imageUrl,
        nicotineRates { name },
        brand { name },
        categories { name }
    }
}`;

const DeleteProductQuery = gql`
    mutation deleteProduct($id: ID!) {
        deleteProduct(id: $id) {
            id
        }
    }
`;

export default compose(
    graphql(ListAllProductsQuery),
    graphql(DeleteProductQuery, {
        props: ({ mutate }) => ({
            deleteProduct: ({ id }) =>
                mutate({
                    variables: { id },
                }),
        })
    })
)(ListProduct);