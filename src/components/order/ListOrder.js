import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import ReactTable from 'react-table';
import {
    ListAllOrdersQuery
} from '../../graphql/queries';

class ListOrder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    render() {

        const columns = [
            {
                Header: 'ID',
                accessor: 'id',
                Cell: props => <p>{props.value}</p>,
                filterable: true,
            },
            {
                Header: 'Etat',
                accessor: 'state',
                Cell: props =>
                    <p>
                        {{PROCESSING: "Traitement en cours", PROCESSED: "Traitée", RECEIVED: "Reçue"}[props.value]}
                    </p>,
                filterable: true,
                Filter: ({filter, onChange}) =>
                    <select
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        value={filter ? filter.value : 'all'}
                    >
                        <option value="">Toutes les commandes</option>
                        <option value="PROCESSING">Traitement en cours</option>
                        <option value="PROCESSED">Traitée</option>
                        <option value="RECEIVED">Reçue</option>
                    </select>
            },
            {
                Header: 'Client',
                accessor: 'owner',
                Cell: props => <p>{props.value.firstName} {props.value.lastName.toUpperCase()}</p>,
                filterable: true,
                filterMethod: (filter, row) => {
                    const id = filter.pivotId || filter.id;

                    return (row[id] ? (
                        row[id].firstName.toLowerCase().includes(filter.value.toLowerCase()) ||
                        row[id].lastName.toLowerCase().includes(filter.value.toLowerCase()))
                        : true);
                }
            },
            {
                Header: 'Date de creation',
                accessor: 'createdAt',
                Cell: props => <p>{props.value.substring(0, 10)}</p>,
            }
        ];

        return (
            <ReactTable
                loadingText='Rafraichissement des données..'
                loading={this.state.loading}
                noDataText='Aucune commande..'
                data={this.props.data.allOrders}
                columns={columns}
                style={{
                    height: '91vh'
                }}
                SubComponent={(row) => {
                    const columns = [
                        {
                            Header: "Article",
                            accessor: "taxon.product.imageUrl",
                            Cell: props => <img alt='product' style={{ height: 60, width: 60 }} src={props.value}/>
                        },
                        {
                            Header: "Produit",
                            accessor: "taxon.product.name",
                            Cell: props => <p>{props.value}</p>
                        },
                        {
                            Header: "Catégorie",
                            accessor: "taxon.taxon.name",
                            Cell: props => <p>{props.value}</p>
                        },
                        {
                            Header: "Quantité",
                            accessor: "quantity",
                            Cell: props => <p>{props.value}</p>
                        }
                    ];

                    return (
                        <ReactTable
                            noDataText='Aucun article..'
                            style={{width: "50%"}}
                            data={row.original.items}
                            columns={columns}
                            defaultPageSize={row.original.items ? row.original.items.length : 0}
                            showPagination={false}
                            sortable={false}
                        />
                    )
                }}
            />
        )
    }
}

export default graphql(ListAllOrdersQuery)(ListOrder)