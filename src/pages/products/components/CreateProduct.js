import React, { Component } from "react";
import _ from "lodash";
import bluebird from "bluebird";
import proptypes from "prop-types";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { compose, graphql } from "react-apollo";
import Select from "react-select";
import ImageUpload from "./ImageUpload";

import {
  UpdateAvailabilityQuery,
  UpdateAvailabilityQueryOptions,
  UpdateProductMutation,
  UpdateProductMutationOptions,
  CreateProductMutation,
  CreateProductMutationOptions,
  CreateProductTaxonsMutation,
  CreateProductTaxonsMutationOptions,
  DeleteProductTaxonsMutation,
  DeleteProductTaxonsMutationOptions
} from "../../../graphql/mutations/index";

import { AllDetailsQuery } from "../../../graphql/queries/index";

import "../styles/createproduct.css";
import "react-select/dist/react-select.css";

class CreateProduct extends Component {
  constructor(props) {
    super(props);

    this.handlePost = this.handlePost.bind(this);

    this.initialState = Object.freeze({
      name: "",
      brandId: "",
      taxonsIds: [],
      initialTaxonsIds: [],
      categoriesIds: [],
      file: null,
      initialFile: "",
      productId: ""
    });

    this.state = { ...this.initialState };
  }

  componentWillReceiveProps({
    name,
    brandId,
    taxonsIds,
    categoriesIds,
    file,
    productId
  }) {
    this.setState({
      name,
      brandId,
      taxonsIds,
      initialTaxonsIds: taxonsIds,
      categoriesIds,
      file,
      initialFile: file,
      productId
    });
  }

  handleProductTaxons(taxonToUpdate) {
    const updatedTaxonsIds = this.state.taxonsIds.map(taxon => {
      if (taxon.id === taxonToUpdate.id) {
        return {
          ...taxon,
          available: !taxon.available
        };
      }

      return taxon;
    });

    this.setState({ taxonsIds: updatedTaxonsIds });
  }

  async uploadFile() {
    const { file } = this.state;

    if (!file) {
      return Promise.resolve(true);
    }

    const data = new FormData();

    data.append("data", file);

    return axios.post(
      "https://api.graph.cool/file/v1/cj57vba1nl6ia0181m1vbe5cr",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  }

  render() {
    const { allBrands, allTaxons, allCategories, loading } = this.props.data;

    if (loading) {
      return <div>Loading...</div>;
    }

    // Options pour le select à multiples choix
    const taxons = _(allTaxons)
      .differenceBy(this.state.taxonsIds, "id")
      .map(taxon => ({ label: taxon.name, value: taxon.id, available: true }))
      .value();
    const brands = allBrands.map(brand => ({
      label: brand.name,
      value: brand.id
    }));
    const categories = _(allCategories)
      .differenceBy(this.state.categoriesIds, "id")
      .map(category => ({ label: category.name, value: category.id }))
      .value();

    return (
      <div className="Createproduct-container">
        <label className="Createproduct-label">
          Nom
          <input
            className="Createproduct-input"
            value={this.state.name}
            placeholder="..."
            onChange={e => this.setState({ name: e.target.value })}
          />
        </label>
        <label className="Createproduct-label">
          {" "}
          Marque
          <Select
            placeholder="..."
            value={this.state.brandId}
            options={brands}
            clearable={false}
            onChange={target => this.setState({ brandId: target.value })}
          />
        </label>
        <label className="Createproduct-label">
          Taxons
          <Select
            placeholder="..."
            multi
            value={this.state.taxonsIds}
            options={taxons}
            onChange={taxonsIds =>
              this.setState({
                taxonsIds: taxonsIds.map(({ id, value, label, available }) => {
                  if (!id) {
                    return { id: value, label, available };
                  }

                  return { id, label, available };
                })
              })}
          />
        </label>
        {this.state.taxonsIds.length > 0 && (
          <div className="Createproduct-switch-container">
            <label className="Createproduct-label">
              Disponibilitées<br />
              {this.state.taxonsIds.map((taxon, k) => (
                <span
                  onClick={() => this.handleProductTaxons(taxon)}
                  className="Createproduct-switch"
                  style={{
                    backgroundColor: taxon.available ? "#1abc9c" : "#D3746A"
                  }}
                  key={k}
                >
                  {taxon.label}
                </span>
              ))}
            </label>
          </div>
        )}
        <label className="Createproduct-label">
          Catégories
          <Select
            placeholder="..."
            multi
            value={this.state.categoriesIds}
            options={categories}
            clearable={false}
            onChange={categoriesIds =>
              this.setState({
                categoriesIds: categoriesIds.map(({ label, id, value }) => {
                  if (!id) {
                    return { id: value, label };
                  }

                  return { id, label };
                })
              })}
          />
        </label>
        <ImageUpload
          onImageSelected={({ file }) => this.setState({ file })}
          imagePreviewUrl={this.state.file}
        />
        {this.state.name &&
        this.state.file && (
          <button className="Createproduct-button" onClick={this.handlePost}>
            {!this.props.editing ? "Ajouter le produit" : "Editer le produit"}
          </button>
        )}
      </div>
    );
  }

  async handleUpdatePost() {
    const {
      productId,
      name,
      brandId,
      taxonsIds,
      initialTaxonsIds,
      categoriesIds,
      file,
      initialFile
    } = this.state;

    let imageUrl = file;

    try {
      //Update image for product if changed
      //TODO: Delete old image
      if (file !== initialFile) {
        imageUrl = (await this.uploadFile()).data.url;
      }

      await this.props.updateProduct({
        id: productId,
        name,
        brandId,
        categoriesIds: categoriesIds.map(({ id }) => id),
        imageUrl
      });

      const toCreate = _.differenceBy(taxonsIds, initialTaxonsIds, "id");
      const toDelete = _.differenceBy(initialTaxonsIds, taxonsIds, "id");
      const toUpdate = initialTaxonsIds.filter(taxon => {
        const associatedTaxon = taxonsIds.find(({ id }) => id === taxon.id);

        return associatedTaxon && associatedTaxon.available !== taxon.available;
      });

      await bluebird.all([
        bluebird.map(toUpdate, ({ productTaxonId, available }) =>
          this.props.updateAvailability({
            id: productTaxonId,
            available: !available
          })
        ),
        bluebird.map(toDelete, ({ productTaxonId }) =>
          this.props.deleteProductTaxons({
            id: productTaxonId
          })
        ),
        bluebird.map(toCreate, ({ id, available }) =>
          this.props.addProductTaxons({
            taxonId: id,
            available,
            productId
          })
        )
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  async handleCreatePost() {
    const { name, brandId, taxonsIds, categoriesIds } = this.state;
    const { data: { allBrands, allCategories } } = this.props;

    try {
      const { data: { url } } = await this.uploadFile();

      const {
        data: { createProduct: { id: productId } }
      } = await this.props.addProduct({
        name,
        imageUrl: url,
        brandId: brandId ? brandId : allBrands[0].id,
        categoriesIds:
          categoriesIds.length > 0
            ? categoriesIds.map(({ id }) => id)
            : allCategories[0].id
      });

      await bluebird.map(taxonsIds, taxon =>
        this.props.addProductTaxons({
          taxonId: taxon.id,
          productId,
          available: taxon.available
        })
      );
    } catch (e) {
      //TODO: Handle error (could not add product)
      console.log(e);
    }
  }

  async handlePost() {
    this.props.closeModal();

    if (this.props.editing) {
      await this.handleUpdatePost();
    } else {
      await this.handleCreatePost();
    }

    this.setState(this.initialState);
    this.props.history.push("/Produits");
  }
}

CreateProduct.proptypes = {
  closeModal: proptypes.func,
  name: proptypes.string,
  brandId: proptypes.string,
  productId: proptypes.string,
  taxonsIds: proptypes.array,
  categoriesIds: proptypes.array,
  file: proptypes.object,
  editing: proptypes.bool
};

CreateProduct.defaultProps = {
  name: "",
  brandId: "",
  taxonsIds: [],
  categoriesIds: [],
  file: null,
  editing: false
};

const CreateProductWithMutationAndQueries = compose(
  graphql(UpdateProductMutation, UpdateProductMutationOptions),
  graphql(CreateProductMutation, CreateProductMutationOptions),
  graphql(CreateProductTaxonsMutation, CreateProductTaxonsMutationOptions),
  graphql(DeleteProductTaxonsMutation, DeleteProductTaxonsMutationOptions),
  graphql(UpdateAvailabilityQuery, UpdateAvailabilityQueryOptions),
  graphql(AllDetailsQuery)
)(CreateProduct);

export default withRouter(CreateProductWithMutationAndQueries);
