import React, { Component } from 'react';

class SelectDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onSelectedValue({ value: e.target.value });
        this.setState({ value: e.target.value });
    }

    render() {
        const { data } = this.props;

        return (
            <div>
                <label>{this.props.label}</label>
                <select
                    onChange={this.handleChange}
                    value={this.state.value}
                >
                    {
                        data.map(({ id, name }, i) => (
                            <option key={i} value={id}>{name}</option>
                        ))
                    }
                </select>
            </div>
        );
    }
}

SelectDetails.propTypes = {
    data: React.PropTypes.array,
    defaultValue: React.PropTypes.string,
    onSelectedValue: React.PropTypes.func,
    label: React.PropTypes.string,
};

export default SelectDetails;