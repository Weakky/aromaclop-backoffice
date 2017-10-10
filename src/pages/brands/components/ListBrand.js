import React, { Component } from "react";
import { ListAllBrandsQuery } from "../../../graphql/queries/index";
import { DeleteBrandQuery } from "../../../graphql/mutations/index";
import { graphql, compose } from "react-apollo";
import Buttons from "../../common/components/Buttons";
import { MdRefresh, MdAdd } from "react-icons/lib/md";
import { MdClose, MdEdit } from "react-icons/lib/md/index";
import ReactTable from "react-table";
import CreateBrand from "./CreateBrand";
import Modal from "react-awesome-modal";

import "../styles/Listbrand.css";
import "../../common/styles/Reactable.css";

class ListBrands extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      editSingleBrand: null
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.openCreateModal = this.openCreateModal.bind(this);
    this.closeCreateModal = this.closeCreateModal.bind(this);
    this.renderCreateOrEditModal = this.renderCreateOrEditModal.bind(this);
  }

  renderModal() {
    return (
      <Modal
        visible={this.state.visible}
        width="300"
        height="130"
        effect="fadeInUp"
        onClickAway={() => this.closeCreateModal()}
      >
        {this.renderCreateOrEditModal()}
      </Modal>
    );
  }

  renderCreateOrEditModal() {
    const { editSingleBrand } = this.state;

    if (editSingleBrand) {
      return (
        <CreateBrand
          closeModal={this.closeCreateModal}
          name={editSingleBrand.name}
          id={editSingleBrand.id}
          editing
        />
      );
    }

    return <CreateBrand closeModal={this.closeCreateModal} />;
  }

  openCreateModal() {
    this.setState({ visible: true });
  }

  closeCreateModal() {
    this.setState({ visible: false, editSingleBrand: null });
    this.props.data.refetch();
  }

  async handleRefresh() {
    this.setState({ loading: true });
    await this.props.data.refetch();
    this.setState({ loading: false });
  }

  async handleDelete(id) {
    await this.props.mutate({
      variables: { id: id }
    });
    await this.props.data.refetch();
  }

  render() {
    const columns = [
      {
        Header: "ID",
        accessor: "id",
        Cell: props => (
          <p className="Reactable-cell" style={{ fontWeight: "bold" }}>
            {props.value}
          </p>
        ),
        filterable: true
      },
      {
        Header: "Nom",
        accessor: "name",
        Cell: props => <p className="Reactable-cell">{props.value}</p>,
        filterable: true
      },
      {
        width: 78,
        Cell: props => (
          <p style={{ textAlign: "center", margin: 0 }}>
            <span
              className="Reactable-edit"
              onClick={() =>
                this.setState({
                  editSingleBrand: { id: props.row.id, name: props.row.name },
                  visible: true
                })}
            >
              <MdEdit />
            </span>
          </p>
        )
      },
      {
        width: 78,
        Cell: props => (
          <p style={{ textAlign: "center", margin: 0 }}>
            {props.row._original.products.length === 0 && (
              <span
                className="Reactable-delete"
                onClick={() => this.handleDelete(props.row.id)}
              >
                <MdClose />
              </span>
            )}
          </p>
        )
      }
    ];
    const buttons = [
      {
        color: "transparent",
        callback: this.handleRefresh,
        icon: <MdRefresh size={18} />,
        label: "Rafraichir les marques"
      },
      {
        color: "transparent",
        callback: this.openCreateModal,
        icon: <MdAdd size={18} />,
        label: "Ajouter une marque"
      }
    ];
    return (
      <div>
        {this.renderModal()}
        <Buttons buttons={buttons} />
        <ReactTable
          loadingText="Rafraichissement des données.."
          loading={this.state.loading}
          noDataText="Aucune données"
          data={this.props.data.allBrands}
          columns={columns}
          className="animated Reactable-table"
          style={{
            height: "91vh"
          }}
        />
      </div>
    );
  }
}

export default compose(graphql(ListAllBrandsQuery), graphql(DeleteBrandQuery))(
  ListBrands
);
