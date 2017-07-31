import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Bar } from 'react-chartjs-2';
import './styles/CountProducts.css'
import { MdRefresh } from 'react-icons/lib/md';
import Button from '../Button';

class CountProducts extends Component {
    constructor(props) {
        super (props);

        this.handleRefresh = this.handleRefresh.bind(this);
    }

    async handleRefresh() {
        this.setState({ loading: true });
        await this.props.data.refetch();
        this.setState({ loading: false })
    };

    render() {
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
                <div style={{ backgroundColor: '#F9F9F9' }}>
                    <Button
                        color='#1abc9c'
                        callback={this.handleRefresh}
                        icon={<MdRefresh size={18}/>}
                        label="Rafraichir"
                    />
                </div>            </div>);
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