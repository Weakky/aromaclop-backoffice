import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { gql, graphql } from "react-apollo";
import Button from "../../common/components/Button";
import { MdRefresh } from "react-icons/lib/md";
import Spinner from "react-spinkit";

import "../styles/Overview.css";

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };

    this.handleRefresh = this.handleRefresh.bind(this);
  }

  async handleRefresh() {
    this.setState({ loading: true });
    await this.props.data.refetch();
    this.setState({ loading: false });
  }

  render() {
    const {
      loading,
      allProductCount,
      fullyAvailableProductCount,
      partiallyAvailableProductCount,
      notAvailableProductCount,
      processingOrders,
      processedOrders
    } = this.props.data;

    if (loading)
      return (
        <div className="Overview-spinner">
          <Spinner name="ball-clip-rotate-multiple" color="#d3746a" noFadeIn />
        </div>
      );

    const chartProps = [
      {
        data: {
          labels: ["Disponibles", "Partiellement disponibles", "Indisponibles"],
          datasets: [
            {
              data: [
                fullyAvailableProductCount.count,
                partiallyAvailableProductCount.count,
                notAvailableProductCount.count
              ],
              borderWidth: 0,
              backgroundColor: ["#1abc9c", "#ffce56", "#d3746a"],
              hoverBackgroundColor: [
                "rgba(26, 188, 156, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(211, 116, 106, 0.8)"
              ]
            }
          ]
        },
        component: Bar,
        summary: " Total des produits: " + allProductCount.count
      },
      {
        data: {
          labels: ["Traitement en cours", "Traitées"],
          datasets: [
            {
              label: "order-count",
              data: [processingOrders.count, processedOrders.count],
              backgroundColor: "rgba(0,102,204,0.5)",
              borderColor: "rgba(0,91,183,0.5)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(0,102,204,0.6)",
              hoverBorderColor: "rgba(0,91,183,0.6)"
            }
          ]
        },
        component: Bar,
        summary:
          " Total des commandes en cours: " +
          (processedOrders.count + processingOrders.count)
      }
    ];

    const charts = chartProps.map(
      ({ component: Component, data, options, summary }) => {
        return (
          <div key={"chart-" + data.datasets[0].label}>
            <div className="Overview-chart">
              <Component data={data} options={options} />
            </div>
          </div>
        );
      }
    );

    return (
      <div className="Overview-container">
        <div className="Overview-buttons">
          <Button
            color="transparent"
            callback={this.handleRefresh}
            icon={<MdRefresh size={18} />}
            label="Rafraichir les données"
          />
        </div>
        {this.state.loading ? (
          <div className="Overview-spinner">
            <Spinner
              name="ball-clip-rotate-multiple"
              color="#d3746a"
              noFadeIn
            />
          </div>
        ) : (
          <div className="Overview-charts">{charts}</div>
        )}
      </div>
    );
  }
}

const CountDataQuery = gql`
  query allProductsCount {
    allProductCount: _allProductsMeta {
      count
    }
    fullyAvailableProductCount: _allProductsMeta(
      filter: { productTaxons_every: { available: true } }
    ) {
      count
    }
    partiallyAvailableProductCount: _allProductsMeta(
      filter: {
        AND: [
          { productTaxons_some: { available: true } }
          { productTaxons_some: { available: false } }
        ]
      }
    ) {
      count
    }
    notAvailableProductCount: _allProductsMeta(
      filter: { productTaxons_every: { available: false } }
    ) {
      count
    }
    processingOrders: _allOrdersMeta(filter: { state: PROCESSING }) {
      count
    }
    processedOrders: _allOrdersMeta(filter: { state: PROCESSED }) {
      count
    }
  }
`;

export default graphql(CountDataQuery)(Overview);
