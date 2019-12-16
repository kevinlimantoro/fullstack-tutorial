import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import Pages from "./pages";
import gql from "graphql-tag";
import React from "react";
import ReactDOM from "react-dom";
import { resolvers, typeDefs } from "./resolvers";

import Login from "./pages/login";
import injectStyles from "./styles";

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: "http://localhost:4000/graphql",
  headers: {
    authorization: localStorage.getItem("token")
  }
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("token"),
    cartItems: []
  }
});

const client = new ApolloClient({
  cache,
  link,
  resolvers,
  typeDefs
});

client
  .query({
    query: gql`
      query GetLaunch {
        launch(id: 56) {
          id
          mission {
            name
          }
        }
      }
    `
  })
  .then(result => console.log("item", result));
const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}

injectStyles();
ReactDOM.render(
  <ApolloProvider client={client}>
    <IsLoggedIn />
  </ApolloProvider>,
  document.getElementById("root")
);
