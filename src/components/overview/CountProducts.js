import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Bar } from 'react-chartjs';

class CountProducts extends Component {
    render() {
        if (this.props.data.loading)
            return(<h1>loading</h1>);
        const data = {
             labels: ["Disponibles", "Partiellement disponibles", "Indisponibles"],
             datasets: [{
                 label: 'Available product count',
                 data: [
                     this.props.data.fullyAvailableProductCount.count,
                     this.props.data.partiallyAvailableProductCount.count,
                     this.props.data.notAvailableProductCount.count],
             }]};

            return (
                <div>
                    <Bar data={data} width="600" height="250"/>
                    <p>Total des produits: {this.props.data.allProductCount.count}</p>
                </div>);
        }
}

const CountProductsQuery = gql`query allProductsCount {
    allProductCount: _allProductsMeta { count }
    fullyAvailableProductCount: _allProductsMeta(filter: {
      productTaxons_every: { available: true }})
      { count }
  	partiallyAvailableProductCount: _allProductsMeta(filter: {
      AND: [
        {productTaxons_some: { available: true }},
        {productTaxons_some: { available: false }} 
      ]
    })
	 { count }
  notAvailableProductCount: _allProductsMeta(filter: {
  	productTaxons_every: { available: false }})
    { count }
}`;

export default graphql(CountProductsQuery)(CountProducts);