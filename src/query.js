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
      createUser
      lastModifiedUser
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation ($projectName: String!, $syntax: String!, $userId: String!) {
    createProject(projectName: $projectName, syntax: $syntax, userId: $userId) {
      success
      data {
        _id
        hash
        projectName
        syntax
        createTime
        updateTime
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation ($id: String!, $isTop: Boolean) {
    createProject(id: $id, isTop: $isTop) {
      success
    }
  }
`;

export const REMOVE_PROJECT = gql`
  mutation ($id: String!) {
    removeProject(id: $id) {
      success
      data {
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
  }
`;

export const GET_PROJECT_ID = gql`
  query ($_id: String, $hash: String) {
    project(_id: $_id, hash: $hash) {
      _id
      hash
    }
  }
`;

export const GET_USER_LIST = gql`
  query ($_id: String, $hash: String) {
    project(_id: $_id, hash: $hash) {
      _id
      editInfo {
        userId
        userName
        avatar
        isOnline
        isEditing
      }
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
