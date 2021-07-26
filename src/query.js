import gql from 'graphql-tag';

export const CREATE_USER = gql`
  mutation ($userName: String!, $avatar: String!) {
    createUser(userName: $userName, avatar: $avatar) {
      success
      userId
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
