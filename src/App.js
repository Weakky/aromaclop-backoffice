import React, { Component } from "react";

import Root from "./pages/layout/components/Root";
import Sidebar from "./pages/layout/components/Sidebar";
import SidebarItem from "./pages/layout/components/SidebarItem";
import Main from "./pages/layout/components/Main";

import ListProduct from "./pages/products/components/ListProduct";
import ListOrder from "./pages/orders/components/ListOrder";
import ListBrand from "./pages/brands/components/ListBrand";
import ListCategorie from "./pages/categories/components/ListCategory";
import ListTaxon from "./pages/taxons/components/ListTaxon";
import ListUser from "./pages/users/components/ListUser";
import Overview from "./pages/overview/components/Overview";
import ApolloClient, { createNetworkInterface } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  NavLink
} from "react-router-dom";
import {
  TiBriefcase,
  TiChartAreaOutline,
  TiShoppingBag,
  TiShoppingCart,
  TiBookmark,
  TiGroupOutline,
  TiChartLineOutline,
  TiPipette
} from "react-icons/lib/ti";

import "./App.css";
import "tachyons";

const networkInterface = createNetworkInterface({
  uri: "https://api.graph.cool/simple/v1/cj57vba1nl6ia0181m1vbe5cr"
});

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: o => o.id
});

class App extends Component {
  render() {
    const tree = [
      {
        title: "Vue d'ensemble",
        name: "Statistiques",
        icon: <TiChartAreaOutline size={19} className="App-icon" />
      },
      {
        name: "Revenus",
        icon: <TiChartLineOutline size={19} className="App-icon" />
      },
      {
        title: "E-Commerce",
        name: "Commandes",
        icon: <TiShoppingCart size={19} className="App-icon" />
      },
      {
        name: "Clients",
        icon: <TiGroupOutline size={19} className="App-icon" />
      },
      {
        title: "Gestion du stock",
        name: "Produits",
        icon: <TiShoppingBag size={19} className="App-icon" />
      },
      {
        name: "Marques",
        icon: <TiBriefcase size={19} className="App-icon" />
      },
      {
        name: "Categories",
        icon: <TiBookmark size={19} className="App-icon" />
      },
      {
        name: "Taxons",
        icon: <TiPipette size={19} className="App-icon" />
      }
    ];

    return (
      <ApolloProvider client={client}>
        <Router>
          <Root>
            <Sidebar>
              {tree.map(leaf => (
                <SidebarItem key={leaf.name}>
                  {leaf.title && <p className="App-link-title">{leaf.title}</p>}
                  <NavLink
                    activeClassName="App-link-active"
                    className="App-link"
                    to={`/${leaf.name}`}
                  >
                    {leaf.icon}
                    <span className="App-link-label">{leaf.name}</span>
                  </NavLink>
                </SidebarItem>
              ))}
            </Sidebar>
            <Main>
              <Route
                exact={true}
                path="/"
                render={() => <Redirect from="/" to="/Statistiques" />}
              />
              <Route exact={true} path="/Statistiques" component={Overview} />
              <Route exact={true} path="/Produits" component={ListProduct} />
              <Route exact={true} path="/Commandes" component={ListOrder} />
              <Route exact={true} path="/Marques" component={ListBrand} />
              <Route
                exact={true}
                path="/Categories"
                component={ListCategorie}
              />
              <Route exact={true} path="/Taxons" component={ListTaxon} />
              <Route exact={true} path="/Clients" component={ListUser} />
            </Main>
          </Root>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
