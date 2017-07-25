import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';

let PieChart = require("react-chartjs").Bar;


class CountProductPerAvailability extends Component {
    render() {
        if (this.props.data.loading)
            return(<h1>loading</h1>);
        else {

            const data = {
                labels: ["Fully Available product", "partially Available product", "Not Available product"],
                datasets: [{
                    label: 'Available product count',
                    data: [
                        this.props.data.fullyAvailableProductCount.count,
                        this.props.data.partiallyAvailableProductCount.count,
                        this.props.data.notAvailableProductCount.count],
                }]
            };

            return (<PieChart data={data} width="600" height="250"/>);
        }
    }
}

const CountProductPerAvailabilityQuery = gql`query allProducts {
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

export default graphql(CountProductPerAvailabilityQuery)(CountProductPerAvailability);