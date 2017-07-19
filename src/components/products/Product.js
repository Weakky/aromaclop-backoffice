import React from 'react';
import { gql, graphql } from 'react-apollo';

class Product extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='pa3 bg-black-05 ma3'>
                <div className='pt3'>
                    ID: {this.props.product.id}<br />
                    Name: {this.props.product.name}<br />
                    Brand: { this.props.product.brand.name }<br />
                    Nicotine rates: { this.props.product.nicotineRates.name }<br />
                    Categories: { this.props.product.categories.map(({ name }) => name).join(', ') }
                    { this.props.product.imageUrl && <img src={this.props.product.imageUrl}/> }
                    <span className='red f6 pointer dim' onClick={this.props.handleDelete}>Delete</span>
                </div>
            </div>
        )
    }
}

Product.propTypes = {
    handleDelete: React.PropTypes.func,
};

export default Product;