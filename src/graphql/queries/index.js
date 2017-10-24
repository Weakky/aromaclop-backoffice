import { gql } from "react-apollo";

export const ListAllTaxonsQuery = gql`
	query allTaxons {
		allTaxons {
			id
			createdAt
			name
			availabilities {
				id
			}
		}
	}
`;

export const ListAllCategoriesQuery = gql`
  query allCategories {
    allCategories {
      id
      createdAt
      name
      products {
        name
      }
    }
  }
`;

export const ListAllProductsQuery = gql`
  query allProducts {
    allProducts {
      id
      name
      price
      imageUrl
      brand {
        id
        name
      }
      categories {
        id
        name
      }
      productTaxons {
        id
        taxon {
          id
          name
        }
        available
        product {
          id
          name
        }
      }
      packages {
        id
        price
        quantity
      }
    }
  }
`;

export const ListAllUsersQuery = gql`
	query allUsers {
		allUsers {
			id
			createdAt
		}
	}
`;

export const ListAllOrdersQuery = gql`
  query allOrders {
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
  }
`;

export const AllDetailsQuery = gql`
  query allDetailsQuery {
    allTaxons {
      id
      name
    }
    allBrands {
      id
      name
    }
    allCategories {
      id
      name
    }
  }
`;

export const ListAllBrandsQuery = gql`
  query ListAllBrands {
    allBrands {
      name
      id
      products {
        name
      }
    }
  }
`;
