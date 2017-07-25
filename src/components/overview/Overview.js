import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import CountProductPerAvailability from './CountProductPerAvailability'

class Overview extends Component {
    render() {
        return (<CountProductPerAvailability />);
    }
}

export default compose()(Overview);