import React, { Component } from "react";
import _ from "lodash";
import bluebird from "bluebird";
import proptypes from "prop-types";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { compose, graphql } from "react-apollo";
import {MdClose, MdAdd} from "react-icons/lib/md";
import Select from "react-select";

import ImageUpload from "./ImageUpload";

import {
  UpdateAvailabilityQuery,
  UpdateAvailabilityQueryOptions,
  UpdateProductMutation,
  UpdateProductMutationOptions,
  CreateProductMutation,
  CreateProductMutationOptions,
  CreatePackageMutation,
  CreatePackageMutationOptions,
  DeletePackageMutation,
  DeletePackageMutationOptions,
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
      name: '',
      brandId: '',
      price: '',
      packages: [],
      initialPackages: [],
      taxonsIds: [],
      initialTaxonsIds: [],
      categoriesIds: [],
      file: null,
      initialFile: '',
      productId: ''
    });

    this.state = { ...this.initialState };

    this.addPackage = this.addPackage.bind(this);
    this.removePackage = this.removePackage.bind(this);
    this.editPackage = this.editPackage.bind(this);
  }

  componentWillReceiveProps({
    name,
    brandId,
    taxonsIds,
    categoriesIds,
    file,
    productId,
    packages,
    price,
  }) {
    this.setState({
      name,
      price,
      brandId,
      taxonsIds,
      initialTaxonsIds: taxonsIds,
      categoriesIds,
      file,
      initialFile: file,
      productId,
      packages,
      initialPackages: packages,
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

  addPackage() {
    this.setState({
      packages: [...this.state.packages, { price: null, quantity: null }]
    })
  }

  removePackage(packageIndex) {
    this.setState({
      packages: this.state.packages.filter((_, i) => i !== packageIndex)
    })
  }

  editPackage({ price, quantity, index }) {
    this.setState({
     packages: Object.assign([], this.state.packages, {[index]: { price, quantity }})
    })
  }

  render() {
    const { allBrands, allTaxons, allCategories, loading, error } = this.props.data;

    if (loading || error) {
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
        <div className="Createproduct-row-container">
          <div className="Createproduct-column-container">
            <label className="Createproduct-semi-label">
              Nom
              <input
                className="Createproduct-input"
                value={this.state.name}
                placeholder="..."
                onChange={e => this.setState({ name: e.target.value })}
              />
            </label>
            <label className="Createproduct-semi-label">
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
          </div>
          <ImageUpload
            onImageSelected={({ file }) => this.setState({ file })}
            imagePreviewUrl={this.state.file}
          />
        </div>
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
          Prix unitaire
          <input
            className="Createproduct-input"
            value={this.state.price}
            placeholder="Prix unitaire en €"
            onChange={(e) => this.setState({ price: e.target.value })}
          />
        </label>
        <label className="Createproduct-label">
          Prix par lots
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {
              this.state.packages.map((pack, i) => (
                <div className="Createproduct-package-container" key={i}>
                  <input
                    id={`quantity-${i}`}
                    className="Createproduct-input-package"
                    placeholder="Quantité"
                    onChange={(e) => this.editPackage({
                      quantity: e.target.value,
                      price: this.state.packages[i].price,
                      index: i
                    })}
                    value={pack.quantity || ''}
                  />
                  <input
                    id={`price-${i}`}
                    className="Createproduct-input-package"
                    placeholder="Prix du lot en €"
                    onChange={(e) => this.editPackage({
                      price: e.target.value,
                      quantity: this.state.packages[i].quantity,
                      index: i
                    })}
                    value={pack.price || ''}
                  />
                  <span className="Createproduct-delete-package" onClick={() => this.removePackage(i)}>
                    <MdClose />
                  </span>
                </div>
              ))
            }
          </div>
          <span className="Createproduct-create-package" onClick={this.addPackage}>
            Ajouter un package
          </span>
        </label>
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
      price,
      brandId,
      taxonsIds,
      initialTaxonsIds,
      categoriesIds,
      file,
      initialFile,
      packages,
      initialPackages,
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
         price: parseFloat(price),
         name,
         brandId,
         categoriesIds: categoriesIds.map(({ id }) => id),
         imageUrl
       });

       const toCreateTaxons = _.differenceBy(taxonsIds, initialTaxonsIds, 'id');
       const toDeleteTaxons = _.differenceBy(initialTaxonsIds, taxonsIds, 'id');
       const toUpdateTaxons = initialTaxonsIds.filter((taxon) => {
         const associatedTaxon = taxonsIds.find(({ id }) => id === taxon.id);

         return associatedTaxon && associatedTaxon.available !== taxon.available;
       });

      const toCreatePackages = _.differenceBy(packages, initialPackages, 'id');
      const toDeletePackages = _.differenceBy(initialPackages, packages, 'id');

      await bluebird.all([
         bluebird.map(toUpdateTaxons, ({ productTaxonId, available }) =>
           this.props.updateAvailability({
             id: productTaxonId,
             available: !available
           })
         ),
         bluebird.map(toDeleteTaxons, ({ productTaxonId }) =>
           this.props.deleteProductTaxons({
             id: productTaxonId
           })
         ),
         bluebird.map(toCreateTaxons, ({ id, available }) =>
           this.props.addProductTaxons({
             taxonId: id,
             available,
             productId
           })
         ),
        bluebird.map(toDeletePackages, ({ id }) => (
          this.props.deletePackage({ id })
        )),
        bluebird.map(toCreatePackages, (pack) => (
          this.props.createPackage({
            productId,
            price: parseFloat(pack.price),
            quantity: parseInt(pack.quantity)
          })
        ))
       ]);
    } catch (e) {
      console.log(e);
    }
  }

  async handleCreatePost() {
    const { name, price, brandId, taxonsIds, categoriesIds, packages } = this.state;
    const { data: { allBrands, allCategories } } = this.props;

    try {
      const { data: { url } } = await this.uploadFile();

      const {
        data: { createProduct: { id: productId } }
      } = await this.props.addProduct({
        name,
        price: parseFloat(price),
        imageUrl: url,
        brandId: brandId ? brandId : allBrands[0].id,
        categoriesIds:
          categoriesIds.length > 0
            ? categoriesIds.map(({ id }) => id)
            : allCategories[0].id
      });

      await bluebird.map(taxonsIds, (taxon) => (
        this.props.addProductTaxons({
          taxonId: taxon.id,
          productId,
          available: taxon.available
        })
      ));

      await bluebird.map(packages, (pack) => (
        this.props.createPackage({
          productId,
          price: parseFloat(pack.price),
          quantity: parseInt(pack.quantity)
        })
      ))

    } catch (e) {
      //TODO: Handle error (could not add product)
      console.error('Failed creating product', e);
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
  editing: proptypes.bool,
  packages: proptypes.array,
  price: proptypes.number,
};

CreateProduct.defaultProps = {
  name: '',
  brandId: '',
  taxonsIds: [],
  categoriesIds: [],
  file: null,
  editing: false,
  packages: [],
  price: '',
};

const CreateProductWithMutationAndQueries = compose(
  graphql(UpdateProductMutation, UpdateProductMutationOptions),
  graphql(CreateProductMutation, CreateProductMutationOptions),
  graphql(CreatePackageMutation, CreatePackageMutationOptions),
  graphql(DeletePackageMutation, DeletePackageMutationOptions),
  graphql(CreateProductTaxonsMutation, CreateProductTaxonsMutationOptions),
  graphql(DeleteProductTaxonsMutation, DeleteProductTaxonsMutationOptions),
  graphql(UpdateAvailabilityQuery, UpdateAvailabilityQueryOptions),
  graphql(AllDetailsQuery)
)(CreateProduct);

export default withRouter(CreateProductWithMutationAndQueries);
