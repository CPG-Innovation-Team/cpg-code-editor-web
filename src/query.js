import gql from 'graphql-tag';

export const SEARCH_PROJECT = gql`
  query ($_id: String, $hash: String) {
    project(_id: $_id, hash: $hash) {
      _id
      hash
      projectName
      code
      createTime
      updateTime
      syntax
      createUser
      lastModifiedUser
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation ($projectName: String!, $syntax: String!, $userId: String!) {
    createUser(projectName: $projectName, syntax: $syntax, userId: $userId) {
      success
      data
    }
  }
`;

export const REMOVE_PROJECT = gql`
  mutation ($id: String!) {
    createUser(id: $id) {
      result
    }
  }
`;

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
