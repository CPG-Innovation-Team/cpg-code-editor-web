import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation ($userName: String!, $avatar: String!) {
    createUser(userName: $userName, avatar: $avatar) {
      success
      userId
    }
  }
`;

export const UPDATE_USER = gql`
  mutation ($id: String!, $userName: String, $avatar: String) {
    updateUser(id: $id, userName: $userName, avatar: $avatar) {
      success
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation ($projectName: String!, $syntax: String!) {
    createProject(projectName: $projectName, syntax: $syntax) {
      success
      data {
        _id
        hash
        code
        updateTime
        syntax
      }
    }
  }
`;
