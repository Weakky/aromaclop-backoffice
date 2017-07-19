import React from 'react';
import { gql, withApollo } from 'react-apollo';

class SelectCategory extends React.Component {

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
            query: CategoriesQuery,
        })
            .then(({ data }) => {
                this.setState({
                    data,
                    value: data.allCategories[0].id
                });
                this.props.onSelectedValue({ value: data.allCategories[0].id });
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
                <label>Choose a category:</label>
                <select
                    onChange={this.handleChange}
                    value={this.state.value}
                >
                    {
                        data.allCategories.map(({ id, name }, i) => (
                            <option key={i} value={id}>{name}</option>
                        ))
                    }
                </select>
            </div>
        );
    }
}

SelectCategory.propTypes = {
    onSelectedValue: React.PropTypes.func.isRequired,
};

const CategoriesQuery = gql`query allCategories {
    allCategories {
        id,
        name
    }
}`;

export default withApollo(SelectCategory);