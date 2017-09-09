import React, { Component } from "react";
import proptypes from "prop-types";
import Button from "../Button";
import { MdAdd } from "react-icons/lib/md";
import { graphql } from "react-apollo";
import { CreateBrandQuery } from "../../graphql/mutations";
import CreateProduct from "../products/CreateProduct";

import "./styles/createbrand.css";

class CreateBrand extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      name: ""
    };

    this.state = { ...this.initialState };

    this.handlePost = this.handlePost.bind(this);
  }

  async handlePost() {
    await this.props.mutate({
      variables: { name: this.state.name }
    });
    this.props.closeModal();
    this.setState(this.initialState);
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
            icon={<MdAdd size={18} />}
            label="Ajouter une marque"
          />
        )}
      </div>
    );
  }
}

CreateProduct.proptypes = {
  closeModal: proptypes.func.isRequired
};

export default graphql(CreateBrandQuery)(CreateBrand);
