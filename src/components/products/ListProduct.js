import React, { Component } from 'react';
import ReactTable from 'react-table';
import bluebird from 'bluebird';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { MdAdd, MdClose, MdCreate, MdRefresh } from 'react-icons/lib/md';
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
            editable: false,
            edited: {}
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.applyTaxonsChanges = this.applyTaxonsChanges.bind(this);
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

    updateTaxons(taxon) {
        if (this.state.editable) {
            this.setState({
                edited: {
                    ...this.state.edited,
                    [taxon.product.id]: {
                        ...this.state.edited[taxon.product.id],
                        [taxon.id]: {
                            productName: taxon.product.name,
                            name: taxon.taxon.name,
                            id: taxon.id.name,
                            available: this.editedTaxonAvailable(taxon)
                                ? !this.editedTaxonAvailable(taxon).available
                                : !taxon.available
                        }
                    }
                }
            })
        }
    }

    editedTaxonAvailable(taxon) {
        return this.state.edited[taxon.product.id] &&
            this.state.edited[taxon.product.id][taxon.id];
    }

    taxonBackgroundColor(taxon) {
        if (this.editedTaxonAvailable(taxon)) {
            return this.editedTaxonAvailable(taxon).available ? '#1abc9c' : '#d3746a';
        }

        return taxon.available ? '#1abc9c' : '#d3746a';
    }

    //TODO: Call this function when rendering the modal showing the updates that are going to be validated.
    //TODO: Idea: Render additions in green, deletions in red, per product. Something like:
    //                 FR-M:
    //                      + 0mg sera disponible
    //                      + 6mg sera disponible
    //                      - 11mg sera plus disponible
    //                      - 16mg sera plus disponible
    //                 FR-K:
    //                      ...
    taxonsUpdatedMessage() {
        const updatedProductsIds = Object.keys(this.state.edited);

        updatedProductsIds.forEach((productId) => {
            const updatedTaxonsIds = Object.keys(this.state.edited[productId]);

            updatedTaxonsIds.forEach((taxonId) => {
                const updatedTaxon = this.state.edited[productId][taxonId];

                if (updatedTaxon.available) {
                    console.log(`Le produit ${updatedTaxon.productName} sera disponible en ${updatedTaxon.name}`);
                } else {
                    console.log(`Le produit ${updatedTaxon.productName} sera plus disponible en ${updatedTaxon.name}`);;
                }
            })
        });
    }

    async applyTaxonsChanges() {
        const updatedProductsIds = Object.keys(this.state.edited);

        await bluebird.map(updatedProductsIds, (productId) => {
            const updatedTaxonsIds = Object.keys(this.state.edited[productId]);

            return bluebird.map(updatedTaxonsIds, (taxonId) => {
                const { available } = this.state.edited[productId][taxonId];

                return this.props.updateAvailability({ id: taxonId, available });
            });
        });

        this.taxonsUpdatedMessage();
        this.setState({ edited: {}, editable: false });
    }

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
            width: 250,
        },
        {
            Header: 'Marque',
            accessor: 'brand.name',
            Cell: props => <p className='Listproduct-cell'>{props.value}</p>,
            filterable: true,
            width: 250,
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
                    taxons
                        .map((taxon, i) => (
                        <span
                            style={{ 
                                backgroundColor: this.taxonBackgroundColor(taxon),
                                cursor: this.state.editable && 'pointer',
                            }} 
                            className="Listproduct-vignette"
                            key={i}
                            onClick={() => this.updateTaxons(taxon)}
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
            width: 78,
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
                    height="620"
                    effect="fadeInUp"
                    onClickAway={() => this.closeModal()}
                >
                    <div className="Listproduct-header-modal">
                        <MdAdd style={{ color: '#F9F9F9', marginRight: 5 }}size={16}/><span className="Listproduct-header-label">Ajout d'un produit</span>
                    </div>
                    <div className="Listproduct-modal">
                        <CreateProduct closeModal={this.closeModal}/>
                    </div>
                </Modal>
                <div className='Listproduct-buttons'>
                    <div className='Listproduct-button'>
                        <span
                            style={{ backgroundColor: '#1abc9c'}}
                            className='Listproduct-link'
                            onClick={() => this.handleRefresh()}>
                                <MdRefresh className="ListProduct-icon" size={18}/>
                                <span className="Listproduct-link-label">Rafraichir les produits</span>
                        </span>
                    </div>
                    <div className='Listproduct-button'>
                        {
                            !this.state.editable ?
                                <span
                                    style={{ backgroundColor: '#1abc9c'}}
                                    className='Listproduct-link'
                                    onClick={() => this.setState({ editable: true })}>
                                        <MdCreate className="ListProduct-icon" size={18}/>
                                        <span className="Listproduct-link-label">Activer le mode édition</span>
                                </span>
                            :
                                 <span
                                    style={{ backgroundColor: '#CC6155'}}
                                    className='Listproduct-link'
                                    onClick={this.applyTaxonsChanges}>
                                        <MdCreate className="ListProduct-icon" size={18}/>
                                        <span className="Listproduct-link-label">Appliquer les modifications</span>
                                </span>
                        }
                    </div>
                    <div className='Listproduct-button'>
                        <span
                            style={{ backgroundColor: '#1abc9c'}}
                            className='Listproduct-link'
                            onClick={() => this.openModal()}>
                            <MdAdd className="ListProduct-icon" size={18}/>
                            <span className="Listproduct-link-label">Ajouter un produit</span>
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
                        height: '91vh'
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
            id
            taxon { name }
            available
            product { id, name }
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

const DeleteProductQueryOptions = {
    props: ({ mutate }) => ({
        deleteProduct: ({ id }) =>
            mutate({
                variables: { id },
            }),
    })
};

const UpdateAvailabilityQuery = gql`
  mutation updateProductTaxons($id: ID!, $available: Boolean) {
      updateProductTaxons(id: $id, available: $available) {
          id
          available
      }
  } 
`;

const UpdateAvailabilityQueryOptions = {
    props: ({ mutate }) => ({
        updateAvailability: ({ id, available }) =>
            mutate({
                variables: { id, available },
            })
    })
};

export default compose(
    graphql(ListAllProductsQuery),
    graphql(DeleteProductQuery, DeleteProductQueryOptions),
    graphql(UpdateAvailabilityQuery, UpdateAvailabilityQueryOptions)
)(ListProduct);