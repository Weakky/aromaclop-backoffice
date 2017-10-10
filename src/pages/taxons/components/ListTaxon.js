import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { ListAllTaxonsQuery } from "../../../graphql/queries/index";
import { DeleteTaxonQuery } from "../../../graphql/mutations/index";
import CreateTaxon from "../components/CreateTaxon";
import Buttons from "../../common/components/Buttons";
import ReactTable from "react-table";
import { MdRefresh, MdAdd } from "react-icons/lib/md";
import { MdEdit, MdClose } from "react-icons/lib/md";
import Modal from "react-awesome-modal";

import "../styles/ListTaxon.css";
import "../../common/styles/Reactable.css";

class ListTaxon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      editSingleCategory: null
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.openCreateModal = this.openCreateModal.bind(this);
    this.closeCreateModal = this.closeCreateModal.bind(this);
    this.renderCreateOrEditModal = this.renderCreateOrEditModal.bind(this);
  }

  renderCreateOrEditModal() {
    const { editSingleTaxon } = this.state;

    if (editSingleTaxon) {
      return (
        <CreateTaxon
          closeModal={this.closeCreateModal}
          name={editSingleTaxon.name}
          id={editSingleTaxon.id}
          editing
        />
      );
    }

    return <CreateTaxon closeModal={this.closeCreateModal} />;
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

  closeCreateModal() {
    this.setState({ visible: false, editSingleTaxon: null });
    this.props.data.refetch();
  }

  openCreateModal() {
    this.setState({ visible: true });
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
                  editSingleTaxon: { id: props.row.id, name: props.row.name },
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
            {props.row._original.availabilities.length === 0 && (
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
        label: "Rafraichir les taxons"
      },
      {
        color: "transparent",
        callback: this.openCreateModal,
        icon: <MdAdd size={18} />,
        label: "Ajouter un taxon"
      }
    ];
    return (
      <div>
        {this.renderModal()}
        <Buttons buttons={buttons} />
        <ReactTable
          loadingText="Rafraichissement des données.."
          loading={this.state.loading}
          noDataText="Aucun taxons.."
          data={this.props.data.allTaxons}
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

export default compose(graphql(ListAllTaxonsQuery), graphql(DeleteTaxonQuery))(
  ListTaxon
);
