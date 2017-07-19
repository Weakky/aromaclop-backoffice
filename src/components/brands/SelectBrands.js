/**
 * Created by desver_f on 19/07/17.
 */
import React from 'react';
import { gql, withApollo } from 'react-apollo';

class SelectBrands extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            data: null,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        this.props.client.query({
            query: BrandQuery,
        })
            .then(({ data }) => {
                this.setState({
                    data,
                    value: data.allBrands[0].id
                });
                this.props.onSelectedValue({ value: data.allBrands[0].id });
            })
            .catch((err) => console.log(err));
    }

    handleChange(e) {
        this.props.onSelectedValue({ value: e.target.value });
        this.setState({ value: e.target.value });
    }

    render() {
        const { data } = this.state;

        if (!data || data.loading) {
            return <div>Loading brands..</div>;
        }

        return (
            <div>
                <label>Choose a brand:</label>
                <select
                    onChange={this.handleChange}
                    value={this.state.value}
                >
                    {
                        data.allBrands.map(({ id, name }, i) => (
                            <option key={i} value={id}>{name}</option>
                        ))
                    }
                </select>
            </div>
        );
    }
}

SelectBrands.propTypes = {
    onSelectedValue: React.PropTypes.func.isRequired,
};

const BrandQuery = gql`query allBrands {
    allBrands {
        id,
        name
    }
}`;

export default withApollo(SelectBrands);