import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Bar } from 'react-chartjs-2';
import './styles/CountProducts.css'


class CountProducts extends Component {
    render() {
        this.props.data.refetch();

        const {
            loading,
            allProductCount,
            fullyAvailableProductCount,
            partiallyAvailableProductCount,
            notAvailableProductCount
        } = this.props.data;

        if (loading)
            return(<h1>loading</h1>);

        const data = {
             labels: ["Disponibles", "Partiellement disponibles", "Indisponibles"],
             datasets: [{
                 label: 'Available product count',
                 data: [
                     fullyAvailableProductCount.count,
                     partiallyAvailableProductCount.count,
                     notAvailableProductCount.count],
                 backgroundColor: "rgba(0,102,204,0.5)",
                 borderColor: "rgba(0,91,183,0.5)",
                 borderWidth: 1,
                 hoverBackgroundColor: "rgba(0,102,204,0.6)",
                 hoverBorderColor: "rgba(0,91,183,0.6)",
             }]};

        const options = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };
            
        return (
            <div>
                <div className="Countproduct-chart">
                    <Bar data={data} options={options}/>
                </div>
                <p className="Countproduct-summary">
                    Total des produits: {allProductCount.count}
                </p>
                <button className="Countproduct-btn" onClick={() => this.props.data.refetch()}>rafraichir</button>
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
        ]})
        { count }
    notAvailableProductCount: _allProductsMeta(filter: {
        productTaxons_every: { available: false }})
        { count }
    }`;

export default graphql(CountProductsQuery)(CountProducts);