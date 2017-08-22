import React, { Component } from 'react'
import { ListAllBrandsQuery } from '../../graphql/queries';
import { graphql } from 'react-apollo';
import Button from '../Button';
import { MdRefresh } from 'react-icons/lib/md';
import ReactTable from 'react-table';

import './styles/Listbrand.css';

class ListBrands extends  Component {
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
        this.setState({ loading: false })
    };

    render() {
        const columns = [
            {
                Header: 'ID',
                accessor: 'id',
                Cell: props => <p className="Listbrand-cell" style={{fontWeight: 'bold'}}>{props.value}</p>,
                filterable: true,
            },
            {
                Header: 'Nom',
                accessor: 'name',
                Cell: props => <p className="Listbrand-cell">{props.value}</p>,
                filterable: true,
            }
            ];
        return (
            <div>
                <div className="Listbrand-buttons">
                    <Button
                        color='transparent'
                        callback={this.handleRefresh}
                        icon={<MdRefresh size={18}/>}
                        label="Rafraichir les marques"
                    />
                </div>
                <ReactTable
                    loadingText='Rafraichissement des données..'
                    loading={this.state.loading}
                    noDataText='Aucune marque..'
                    data={this.props.data.allBrands}
                    columns={columns}
                    className="Listbrand-table"
                    style={{
                        height: '91vh'
                    }}
                />
            </div>
        );
    }
}

export default graphql(ListAllBrandsQuery)(ListBrands);