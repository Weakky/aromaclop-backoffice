import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import {gql, graphql} from 'react-apollo';
import Button from '../Button';
import { MdRefresh } from 'react-icons/lib/md';
import Spinner from 'react-spinkit';

import './styles/Overview.css';

class Overview extends Component {
    constructor(props) {
        super(props);

        this.handleRefresh = this.handleRefresh.bind(this);
    }

    async handleRefresh() {
        this.setState({ loading: true });
        await this.props.data.refetch();
        this.setState({ loading: false });
    };

    render() {

        const {
            loading,
            allProductCount,
            fullyAvailableProductCount,
            partiallyAvailableProductCount,
            notAvailableProductCount,
            processingOrders,
            processedOrders,
        } = this.props.data;

        if (loading)
            return (
                <div className="Overview-spinner">
                    <Spinner
                        name="ball-clip-rotate-multiple"
                        color="#d3746a"
                        noFadeIn
                    />
                </div>
            );

        const chartProps = [
            {
                data: {
                    labels: ["Disponibles", "Partiellement disponibles", "Indisponibles"],
                    datasets: [{
                        label: 'product-count',
                        data: [
                            fullyAvailableProductCount.count,
                            partiallyAvailableProductCount.count,
                            notAvailableProductCount.count],
                        backgroundColor: "rgba(0,102,204,0.5)",
                        borderColor: "rgba(0,91,183,0.5)",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(0,102,204,0.6)",
                        hoverBorderColor: "rgba(0,91,183,0.6)",
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                            }
                        }]
                    }
                },
                component: Bar,
                summary: " Total des produits: " + allProductCount.count
            },
            {
                data: {
                    labels: ["Traitement en cours", "Traitées"],
                    datasets: [{
                        label: 'order-count',
                        data: [
                            processingOrders.count,
                            processedOrders.count,
                        ],
                        backgroundColor: "rgba(0,102,204,0.5)",
                        borderColor: "rgba(0,91,183,0.5)",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(0,102,204,0.6)",
                        hoverBorderColor: "rgba(0,91,183,0.6)",
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                            }
                        }]
                    }
                },
                component: Bar,
                summary: " Total des commandes en cours: " + (processedOrders.count + processingOrders.count)
            }
        ];

        const charts = chartProps.map(({ component: Component, data, options, summary }) => {
                return(
                    <div key={"chart-" + data.datasets[0].label}>
                        <div className="Overview-chart"><Component data={data} options={options} /></div>
                        <div className="Overview-summary">{summary}</div>
                    </div>
                )
            }
        );

        return (
            <div>
                <div style={{ backgroundColor: '#F9F9F9' }}>
                    <Button
                        color='#1abc9c'
                        callback={this.handleRefresh}
                        icon={<MdRefresh size={18}/>}
                        label="Rafraichir"
                    />
                </div>
                {charts}
            </div>
        );
    }
}

const CountDataQuery = gql`query allProductsCount {
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
     processingOrders: _allOrdersMeta(filter: {state: PROCESSING}) {count}
     processedOrders: _allOrdersMeta(filter: {state: PROCESSED}) {count}
    }`;

export default graphql(CountDataQuery)(Overview);