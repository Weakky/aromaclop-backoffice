import React, { Component } from 'react';
import ReactTable from 'react-table';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import {MdAdd, MdRefresh} from 'react-icons/lib/md';
import Modal from 'react-awesome-modal';
import CreateProduct from './CreateProduct';

import './styles/listproduct.css';
import 'react-table/react-table.css';

class ListProduct extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    openModal() {
        this.setState({visible : true});
    };

    closeModal() {
        this.setState({visible : false});
    };

    async handleDelete(id) {
        await this.props.deleteProduct({ id });
        await this.props.data.refetch();
    };

    async handleRefresh() {
        await this.props.data.refetch();
    };

    render() {

    const columns = [
        {
            accessor: 'imageUrl',
            Cell: props => <img style={{ height: 60, width: 60 }} src={props.value}/>,
            width: 75,
        },
        {
            Header: 'ID',
            accessor: 'id',
            Cell: props => <p className='Listproduct-cell' style={{ fontWeight: 'bold' }}>{props.value}</p>,
            width: 300,
            filterable: true,
        },
        {
            Header: 'Nom',
            accessor: 'name',
            Cell: props => <p className='Listproduct-cell'>{props.value}</p>,
            width: 200,
            filterable: true,
        },
        {
            Header: 'TN',
            accessor: 'nicotineRates.name',
            Cell: props => <p className='Listproduct-cell'>{props.value}</p>,
            width: 200,
            filterable: true,
        },
        {
            Header: 'Marque',
            accessor: 'brand.name',
            Cell: props => <p className='Listproduct-cell'>{props.value}</p>,
            width: 200,
            filterable: true,
        },
        {
            Header: 'Catégorie',
            accessor: 'categories[0].name',
            Cell: props => <p className='Listproduct-cell'>{props.value}</p>,
            width: 200,
            filterable: true,
        },
        {
            Cell: props => <p style={{ textAlign: 'center', margin: 0}}>
                                <span onClick={() => this.handleDelete(props.row.id)} className='Listproduct-delete'>Supprimer</span>
                            </p>,
        },
    ];

    return (
            <div>
                <Modal
                    visible={this.state.visible}
                    width="400"
                    height="600"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <div className="Listproduct-modal">
                        <CreateProduct closeModal={this.closeModal}/>
                    </div>
                </Modal>
                <div className='Listproduct-buttons'>
                    <div className='Listproduct-button'>
                        <span
                            style={{ backgroundColor: '#0F202E'}}
                            className='Listproduct-link'
                            onClick={() => this.handleRefresh()}>
                                <MdRefresh
                                    className="ListProduct-icon"
                                    size={25}
                                />
                        </span>
                    </div>
                    <div className='Listproduct-button'>
                        <span
                            style={{ backgroundColor: '#1abc9c'}}
                            className='Listproduct-link'
                            onClick={() => this.openModal()}>
                            <MdAdd className="ListProduct-icon" size={25}/>
                        </span>
                    </div>
                </div>
                <ReactTable
                    loading={this.state.loading}
                    className='Listproduct-table -highlight'
                    data={this.props.data.allProducts}
                    columns={columns}
                />
            </div>
        );
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