import React, { Component } from 'react';

import Root from './components/Root';
import Sidebar from './components/Sidebar';
import SidebarItem from './components/SidebarItem';
import Main from './components/Main';

import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import './App.css';

class App extends Component {

  render() {
    const tree = ['Home', 'Products', 'Commands'];

    return (
      <Router>
        <Root>
          <Sidebar>
            {
              tree.map(leaf => (
                <SidebarItem key={leaf}>
                  <Link to={`/${leaf}`}>
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
            <Route exact={true} path='/Home' render={() => (
              <h1>/Home</h1>
            )}/>
            <Route exact={true} path='/Products' render={() => (
              <h1>/Products</h1>
            )}/>
            <Route exact={true} path='/Commands' render={() => (
              <h1>/Commands</h1>
            )}/>
          </Main>
        </Root>
      </Router>
    );
  }
}

export default App;
