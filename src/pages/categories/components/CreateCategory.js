import React, { Component } from "react";
import proptypes from "prop-types";
import Button from "../../common/components/Button";
import { MdAdd } from "react-icons/lib/md";
import { graphql, compose } from "react-apollo";
import {
  CreateCategoryQuery,
  CreateCategoryQueryOptions,
  UpdateCategoryQuery,
  UpdateCategoryQueryOptions
} from "../../../graphql/mutations/index";

import "../styles/CreateCategory.css";
import { MdEdit } from "react-icons/lib/md/index";

class CreateCategory extends Component {
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

    await this.props.updateCategory({ id, name });
  }

  async handleCreate() {
    const { name } = this.state;

    await this.props.createCategory({ name });
  }

  render() {
    return (
      <div className="CreateCategory-container">
        <label className="CreateCategory-label">
          Nom de la catégorie
          <input
            className="CreateCategory-input"
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
              this.props.editing ? (
                "Modifier une catégorie"
              ) : (
                "Ajouter une catégorie"
              )
            }
          />
        )}
      </div>
    );
  }
}

CreateCategory.proptypes = {
  closeModal: proptypes.func.isRequired,
  name: proptypes.string,
  id: proptypes.string,
  editing: proptypes.bool
};

CreateCategory.defaultProps = {
  name: "",
  editing: false
};

export default compose(
  graphql(CreateCategoryQuery, CreateCategoryQueryOptions),
  graphql(UpdateCategoryQuery, UpdateCategoryQueryOptions)
)(CreateCategory);
