import {gql} from 'react-apollo'

export const SIGININ_USER_MUTATION = gql`
mutation SigninUserMutation($email: String!, $password: String!) {
  signinUser(email: {email: $email, password: $password}) {
    token
    user {
      id
      role
    }
  }
}
`;