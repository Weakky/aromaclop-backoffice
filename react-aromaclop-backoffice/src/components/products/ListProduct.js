import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Product from './Product';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class ListProduct extends Component {

  render () {
    if (this.props.data.loading) {
        return (<div>Chargement..</div>)
  }

  return (
    <div className='w-100 flex justify-center'>
      <Link to='/Produits/create' className='fixed bg-white top-0 right-0 pa4 ttu dim black no-underline'>
        + Nouveau produit
      </Link>
      <div className='w-100' style={{ maxWidth: 400 }}>
        {this.props.data.allProducts.map((product) =>
          <Product key={product.id} product={product} refresh={() => this.props.data.refetch()} />
        )}
      </div>
    </div>
  )
}
}

const FeedQuery = gql`query allProducts {
  allProducts {
    id,
    name,
  }
}`

export default graphql(FeedQuery)(ListProduct)