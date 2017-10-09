import { gql } from "react-apollo";
import { ListAllProductsQuery } from "../queries";

export const UpdateCategoryQuery = gql`
  mutation updateCategory($id: ID!, $name: String!) {
    updateCategory(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const UpdateCategoryQueryOptions = {
  props: ({ mutate }) => ({
    updateCategory: ({ id, name }) =>
      mutate({
        variables: { id, name }
      })
  })
};

export const UpdateBrandQuery = gql`
  mutation updateBrand($id: ID!, $name: String!) {
    updateBrand(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const UpdateBrandQueryOptions = {
  props: ({ mutate }) => ({
    updateBrand: ({ id, name }) =>
      mutate({
        variables: { id, name }
      })
  })
};

export const CreateCategoryQuery = gql`
  mutation createCategory($name: String!) {
    createCategory(name: $name) {
      name
    }
  }
`;

export const CreateCategoryQueryOptions = {
  props: ({ mutate }) => ({
    createCategory: ({ name }) =>
      mutate({
        variables: { name }
      })
  })
};

export const CreateBrandQuery = gql`
  mutation createBrand($name: String!) {
    createBrand(name: $name) {
      name
    }
  }
`;

export const CreateBrandQueryOptions = {
  props: ({ mutate }) => ({
    createBrand: ({ name }) =>
      mutate({
        variables: { name }
      })
  })
};

export const DeleteCategoryQuery = gql`
  mutation deleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;

export const DeleteBrandQuery = gql`
  mutation deleteBrand($id: ID!) {
    deleteBrand(id: $id) {
      id
    }
  }
`;

export const DeleteProductQuery = gql`
  mutation deleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

export const DeleteProductQueryOptions = {
  props: ({ mutate }) => ({
    deleteProduct: ({ id }) =>
      mutate({
        variables: { id }
      })
  })
};

export const UpdateAvailabilityQuery = gql`
  mutation updateProductTaxons($id: ID!, $available: Boolean) {
    updateProductTaxons(id: $id, available: $available) {
      id
      available
    }
  }
`;

export const UpdateAvailabilityQueryOptions = {
  props: ({ mutate }) => ({
    updateAvailability: ({ id, available }) =>
      mutate({
        variables: { id, available }
      })
  })
};

export const CreateProductMutation = gql`
  mutation createProduct(
    $name: String!
    $imageUrl: String!
    $brandId: ID
    $categoriesIds: [ID!]
  ) {
    createProduct(
      name: $name
      imageUrl: $imageUrl
      brandId: $brandId
      categoriesIds: $categoriesIds
    ) {
      id
      name
      categories {
        id
        name
      }
      brand {
        id
        name
      }
      imageUrl
      productTaxons {
        id
        available
        taxon {
          name
        }
      }
    }
  }
`;

export const CreateProductMutationOptions = {
  props: ({ mutate }) => ({
    addProduct: ({ name, imageUrl, brandId, categoriesIds }) =>
      mutate({
        variables: {
          name,
          imageUrl,
          brandId,
          categoriesIds
        },
        update: (store, { data: { createProduct } }) => {
          const data = store.readQuery({ query: ListAllProductsQuery });

          data.allProducts.push(createProduct);
          store.writeQuery({ query: ListAllProductsQuery, data });
        }
      })
  })
};

export const UpdateProductMutation = gql`
  mutation updateProduct(
    $id: ID!
    $name: String!
    $imageUrl: String!
    $brandId: ID
    $categoriesIds: [ID!]
  ) {
    updateProduct(
      id: $id
      name: $name
      imageUrl: $imageUrl
      brandId: $brandId
      categoriesIds: $categoriesIds
    ) {
      id
      name
      categories {
        id
        name
      }
      brand {
        id
        name
      }
      imageUrl
    }
  }
`;

export const UpdateProductMutationOptions = {
  props: ({ mutate }) => ({
    updateProduct: ({ id, name, imageUrl, brandId, categoriesIds }) =>
      mutate({
        variables: {
          id,
          name,
          imageUrl,
          brandId,
          categoriesIds
        }
      })
  })
};

export const CreateProductTaxonsMutation = gql`
  mutation createProductTaxons(
    $productId: ID
    $taxonId: ID
    $available: Boolean!
  ) {
    createProductTaxons(
      productId: $productId
      taxonId: $taxonId
      available: $available
    ) {
      id
      available
      taxon {
        id
        name
      }
      product {
        id
        name
      }
    }
  }
`;

export const CreateProductTaxonsMutationOptions = {
  props: ({ mutate }) => ({
    addProductTaxons: ({ productId, taxonId, available }) =>
      mutate({
        variables: {
          productId,
          taxonId,
          available
        },
        update: (store, { data: { createProductTaxons } }) => {
          const data = store.readQuery({ query: ListAllProductsQuery });

          data.allProducts = data.allProducts.map(product => {
            if (product.id === productId) {
              return {
                ...product,
                productTaxons: [...product.productTaxons, createProductTaxons]
              };
            }
            return product;
          });

          store.writeQuery({ query: ListAllProductsQuery, data });
        }
      })
  })
};

export const DeleteProductTaxonsMutation = gql`
  mutation deleteProductTaxons($id: ID!) {
    deleteProductTaxons(id: $id) {
      id
    }
  }
`;

export const DeleteProductTaxonsMutationOptions = {
  props: ({ mutate }) => ({
    deleteProductTaxons: ({ id }) =>
      mutate({
        variables: {
          id
        },
        update: (store, { data: { deleteProductTaxons } }) => {
          const data = store.readQuery({ query: ListAllProductsQuery });

          data.allProducts = data.allProducts.map(product => {
            // We have no reference to the productId, so we have to find it manually
            const associatedProduct = product.productTaxons.find(
              ({ id: taxonId }) => taxonId === deleteProductTaxons.id
            );

            if (associatedProduct) {
              return {
                ...product,
                productTaxons: product.productTaxons.filter(
                  ({ id: taxonId }) => taxonId !== deleteProductTaxons.id
                )
              };
            }
            return product;
          });

          store.writeQuery({ query: ListAllProductsQuery, data });
        }
      })
  })
};
