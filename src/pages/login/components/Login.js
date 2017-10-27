import React, {Component} from "react";
import {graphql} from 'react-apollo';
import {SIGININ_USER_MUTATION} from "../../../graphql/mutations/login";

const GC_USER_ID = 'graphcool-user-id';
const GC_AUTH_TOKEN = 'graphcool-auth-token';

class Login extends Component {
    state = {
        email: '',
        password: '',
    };

    render() {

        return (
            <div>
                <h4>Login</h4>
                <div className='flex flex-column'>
                    <input
                        value={this.state.email}
                        onChange={(e) => this.setState({email: e.target.value})}
                        type='text'
                        placeholder='your email'
                    />

                    <input
                        value={this.state.password}
                        onChange={(e) => this.setState({password: e.target.value})}
                        type='text'
                        placeholder='your password'
                    />
                </div>
                <div className='flex mt3'>
                    <div className='pointer mr2 button' onClick={() => this._confirm}>
                        Login
                    </div>
                </div>
            </div>
        )
    }

    _confirm = async () => {
        const {email, password} = this.state;
        const result = await this.props.signinUserMutation({
            variables: {
                email,
                password
            }
        });

        const {id, role} = result.data.signinUser.user;
        const token = result.data.signinUser.token;

        if (role === "ADMIN") {
            this._saveUserData(id, token);
        }
    };

    _saveUserData = (id, token) => {
        localStorage.setItem(GC_USER_ID, id);
        localStorage.setItem(GC_AUTH_TOKEN, token);
    };
}

export default graphql(SIGININ_USER_MUTATION, {name: 'signinUserMutation'})(Login)
