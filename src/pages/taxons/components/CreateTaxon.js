import React, { Component } from "react";
import proptypes from "prop-types";
import Button from "../../common/components/Button";
import { MdAdd } from "react-icons/lib/md";
import { graphql, compose } from "react-apollo";
import {
  CreateTaxonQuery,
  CreateTaxonQueryOptions,
  UpdateTaxonQuery,
  UpdateTaxonQueryOptions
} from "../../../graphql/mutations/index";

import "../styles/CreateTaxon.css";
import { MdEdit } from "react-icons/lib/md/index";

class CreateTaxon extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      name: "",
      id: ""
    };

    this.state = { ...this.initialState };

    this.handlePost = this.handlePost.bind(this);
  }

  componentWillReceiveProps({ name, id }) {
    this.setState({
      name,
      id
    });
  }

  async handlePost() {
    this.props.editing ? await this.handleEdit() : await this.handleCreate();
    this.props.closeModal();
    this.setState(this.initialState);
  }

  async handleEdit() {
    const { id, name } = this.state;

    await this.props.updateTaxon({ id, name });
  }

  async handleCreate() {
    const { name } = this.state;

    await this.props.createTaxon({ name });
  }

  render() {
    return (
      <div className="CreateTaxon-container">
        <label className="CreateTaxon-label">
          Nom du taxon
          <input
            className="CreateTaxon-input"
            value={this.state.name}
            placeholder="..."
            onChange={e => this.setState({ name: e.target.value })}
          />
        </label>
        {this.state.name && (
          <Button
            color="#1abc9c"
            callback={this.handlePost}
            icon={
              this.props.editing ? <MdEdit size={18} /> : <MdAdd size={18} />
            }
            label={
              this.props.editing ? "Modifier un taxon" : "Ajouter un taxon"
            }
          />
        )}
      </div>
    );
  }
}

CreateTaxon.proptypes = {
  closeModal: proptypes.func.isRequired,
  name: proptypes.string,
  id: proptypes.string,
  editing: proptypes.bool
};

CreateTaxon.defaultProps = {
  name: "",
  editing: false
};

export default compose(
  graphql(CreateTaxonQuery, CreateTaxonQueryOptions),
  graphql(UpdateTaxonQuery, UpdateTaxonQueryOptions)
)(CreateTaxon);
