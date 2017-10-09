import React, { Component } from "react";
import proptypes from "prop-types";
import Button from "../../common/components/Button";
import { MdAdd } from "react-icons/lib/md";
import { graphql, compose } from "react-apollo";
import {
  CreateBrandQuery,
  UpdateBrandQuery,
  CreateBrandQueryOptions,
  UpdateBrandQueryOptions
} from "../../../graphql/mutations/index";

import "../styles/createbrand.css";
import { MdEdit } from "react-icons/lib/md/index";

class CreateBrand extends Component {
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

    await this.props.updateBrand({ id, name });
  }

  async handleCreate() {
    const { name } = this.state;

    await this.props.createBrand({ name });
  }

  render() {
    return (
      <div className="Createbrand-container">
        <label className="Createbrand-label">
          Nom de la marque
          <input
            className="Createbrand-input"
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
              this.props.editing ? "Modifier une marque" : "Ajouter une marque"
            }
          />
        )}
      </div>
    );
  }
}

CreateBrand.proptypes = {
  closeModal: proptypes.func.isRequired,
  name: proptypes.string,
  id: proptypes.string,
  editing: proptypes.bool
};

CreateBrand.defaultProps = {
  name: "",
  editing: false
};

export default compose(
  graphql(CreateBrandQuery, CreateBrandQueryOptions),
  graphql(UpdateBrandQuery, UpdateBrandQueryOptions)
)(CreateBrand);
