import React, { Component } from 'react';

import Root from './components/Root';
import Sidebar from './components/Sidebar';
import SidebarItem from './components/SidebarItem';
import Main from './components/Main';

import ListProduct from './components/products/ListProduct';
import Overview from './components/overview/Overview';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Route, Redirect, NavLink } from 'react-router-dom';
import { MdEqualizer, MdReorder, MdShoppingCart} from 'react-icons/lib/md';

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

    const tree = [
      {
        name: 'Overview',
        icon: <MdEqualizer size={18} className="App-icon"/>,
      },
      {
        name: 'Produits',
        icon: <MdReorder size={18} className="App-icon"/>,
      },
      {
        name: 'Commandes',
        icon: <MdShoppingCart size={18} className="App-icon"/>,
      },
    ];

    return (
      <ApolloProvider client={client}>
        <Router>
          <Root>
            <Sidebar>
              {
                tree.map(leaf => (
                  <SidebarItem key={leaf.name}>
                    <NavLink activeClassName="App-link-active" className="App-link" to={`/${leaf.name}`}>              
                        {leaf.icon}<span className="App-link-label">{leaf.name}</span>
                    </NavLink>
                  </SidebarItem>
                ))
              }
            </Sidebar>
            <Main>
              <Route exact={true} path='/' render={() => <Redirect from="/" to="/Overview" />}/>
              <Route exact={true} path='/Overview' component={Overview}/>
              <Route exact={true} path='/Produits' component={ListProduct}/>
            </Main>
          </Root>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
