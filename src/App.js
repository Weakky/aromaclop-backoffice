import React, { Component } from 'react';

import Root from './components/Root';
import Sidebar from './components/Sidebar';
import SidebarItem from './components/SidebarItem';
import Main from './components/Main';

import ListProduct from './components/products/ListProduct';
import CreateProduct from './components/products/CreateProduct';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import './App.css';
import 'tachyons';

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj57vba1nl6ia0181m1vbe5cr',
});

const client = new ApolloClient({
    networkInterface,
    dataIdFromObject: o => o.id
});

class App extends Component {

  render() {
    const tree = ['Accueil', 'Produits'];

    return (
      <ApolloProvider client={client}>
        <Router>
          <Root>
            <Sidebar>
              {
                tree.map(leaf => (
                  <SidebarItem key={leaf}>
                    <Link className="f9 fw1 white link dim" to={`/${leaf}`}>
                      {leaf}
                    </Link>
                  </SidebarItem>
                ))
              }
            </Sidebar>
            <Main>
              <Route exact={true} path='/' render={() => (
                <h1>/</h1>
              )}/>
              <Route exact={true} path='/Accueil' render={() => (
                <h1>Page d'accueil</h1>
              )}/>
              <Route exact={true} path='/Produits' render={() => (
                <div>
                  <h1>Gestion des produits</h1>
                  <Link to={'/Produits/list'}>Lister</Link><br />
                  <Link to={'/Produits/create'}>Ajouter</Link>
                </div>
              )}/>
              <Route exact={true} path='/Produits/create' component={CreateProduct}/>
              <Route exact={true} path='/Produits/list' component={ListProduct}/>
            </Main>
          </Root>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
