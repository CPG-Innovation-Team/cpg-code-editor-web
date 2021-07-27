import gql from 'graphql-tag';

export const GET_PROJECT = gql`
  query ($_id: String, $hash: String) {
    project(_id: $_id, hash: $hash) {
      _id
      hash
      projectName
      code
      createTime
      updateTime
      syntax
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation ($projectName: String!, $syntax: String!, $userId: String!) {
    createProject(projectName: $projectName, syntax: $syntax, userId: $userId) {
      success
      data
    }
  }
`;

export const REMOVE_PROJECT = gql`
  mutation ($id: String!) {
    removeProject(id: $id) {
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
