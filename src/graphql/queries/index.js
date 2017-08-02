import { gql } from 'react-apollo';

export const ListAllProductsQuery = gql`query allProducts {
    allProducts {
        id,
        name,
        imageUrl,
        brand { id, name },
        categories { id, name },
        productTaxons {
            id
            taxon { id, name }
            available
            product { id, name }
        }
    }
}`;

export const ListAllOrdersQuery  = gql`query allOrders{
  allOrders {
    id
    state
    owner {
      firstName
      lastName
    }
    createdAt
    items {
      taxon {
        product {
          name
          imageUrl
        }
        taxon {
          name
        }
      }
      quantity
    }
  }
}`;


export const AllDetailsQuery = gql`query allDetailsQuery {
    allTaxons {
        id,
        name,
    },
    allBrands {
        id,
        name
    },
    allCategories {
        id,
        name
    }
}`;

export const ListAllBrandsQuery = gql`query ListAllBrands {
  allBrands {
    name,
    id
  }
}`;