import React, { Component } from 'react';
import ReactTable from 'react-table';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { MdAdd, MdRefresh, MdClose} from 'react-icons/lib/md';
import Modal from 'react-awesome-modal';
import CreateProduct from './CreateProduct';

import './styles/listproduct.css';
import 'react-table/react-table.css';

const filterCaseInsensitive = (filter, row) => {
    const id = filter.pivotId || filter.id;

    return (
        row[id]
            ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
            : true
    );
};

class ListProduct extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            loading: false,
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
        this.setState({ loading: true });
        await this.props.data.refetch().then(() => this.setState({loading: false}));
    };

    render() {

    const columns = [
        {
            accessor: 'imageUrl',
            Cell: props => <img alt='product' style={{ height: 60, width: 60 }} src={props.value}/>,
            width: 75,
        },
        {
            Header: 'ID',
            accessor: 'id',
            Cell: props => <p className='Listproduct-cell' style={{ fontWeight: 'bold' }}>{props.value}</p>,
            filterable: true,
            width: 250,
        },
        {
            Header: 'Nom',
            accessor: 'name',
            Cell: props => <p className='Listproduct-cell'>{props.value}</p>,
            filterable: true,
        },
        {
            Header: 'Marque',
            accessor: 'brand.name',
            Cell: props => <p className='Listproduct-cell'>{props.value}</p>,
            filterable: true,
        },
        {
            Header: 'Catégorie',
            accessor: 'categories',
            Cell: (props) => (
                <div className="Listproduct-cell-container">
                    {props.original.categories.map((prop, k) => (
                        <span 
                            key={k} 
                            className="Listproduct-vignette"
                        >
                            {prop.name}
                        </span>
                    ))}
                </div> 
            ),
            filterable: false,
        },
        {
            Header: 'Taxons',
            width: 250,
            accessor: 'productTaxons',
            Cell: ({ value: taxons }) => (
                <div className="Listproduct-cell-container">
                {
                    taxons.map((taxon, i) => (
                        <span 
                            style={{ backgroundColor: taxon.available ? '#1abc9c' : '#d3746a' }} 
                            className="Listproduct-vignette"
                            key={i}
                        >
                            {taxon.taxon.name}
                        </span>
                    ))
                }
                </div>
            )
            ,
            filterable: false,
            sortable: false,
        },
        {
        
            Cell: props => (
                <p style={{ textAlign: 'center', margin: 0}}>
                    <span 
                        onClick={() => this.handleDelete(props.row.id)} 
                        className='Listproduct-delete'
                    >
                        <MdClose/>
                    </span>
                </p>
            ),
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
                    loadingText='Rafraichissement des données..'
                    loading={this.state.loading}
                    noDataText='Chargement des données..'
                    className='Listproduct-table -highlight'
                    data={this.props.data.allProducts}
                    columns={columns}
                    defaultFilterMethod={filterCaseInsensitive}
                    style={{
                        height: '90vh'
                    }}
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
        brand { name },
        categories { name },
        productTaxons {
            taxon { name }
            available
        }
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