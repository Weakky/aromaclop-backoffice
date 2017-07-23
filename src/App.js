import React, { Component } from 'react';

import Root from './components/Root';
import Sidebar from './components/Sidebar';
import SidebarItem from './components/SidebarItem';
import Main from './components/Main';
import HomeView from './components/views/HomeView';

import ListProduct from './components/products/ListProduct';
import CreateProduct from './components/products/CreateProduct';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Link, Route, Redirect } from 'react-router-dom';
import { MdHome, MdViewHeadline, MdShoppingCart} from 'react-icons/lib/md';

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
    //const tree = ['Accueil', 'Produits', 'Commandes'];
    const tree = [
      {
        name: 'Accueil',
        icon: <MdHome className="App-icon"/>,
      },
      {
        name: 'Produits',
        icon: <MdViewHeadline className="App-icon"/>,
      },
      {
        name: 'Commandes',
        icon: <MdShoppingCart className="App-icon"/>,
      },
    ];

    return (
      <ApolloProvider client={client}>
        <Router>
          <Root>
            <Sidebar>
              {
                tree.map(leaf => (
                  <Link key={leaf.name} className="App-link" to={`/${leaf.name}`}>
                    <SidebarItem>
                      {leaf.icon}{leaf.name}
                    </SidebarItem>
                    <hr className="App-separator"/>
                  </Link>
                ))
              }
            </Sidebar>
            <Main>
              <Route exact={true} path='/' render={() => <Redirect from="/" to="/Accueil" />}/>
              <Route exact={true} path='/Accueil' component={HomeView}/>
              <Route exact={true} path='/Produits' component={ListProduct}/>
              <Route exact={true} path='/Produits/create' component={CreateProduct}/>
            </Main>
          </Root>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
