import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";
//import { setCurrentAccount } from './actions/authenticationActions'
// Apollo
import { ApolloProvider } from "react-apollo";

// Localization
import T from "i18n-react";

import App from "./components/Layouts/App";
import client from "./apollo";

// A state for the entire project created by Redux
const store = createStore(
  rootReducer,
  //(state = {}) => state, // Dummy Reducer
  composeWithDevTools(applyMiddleware(thunk))
);

/*
// Parse subdomain 
let subdomain =  getSubdomain()
subdomain && setSubdomain(subdomain)

if (localStorage.currentAccount) {
  // Retrieve the object from storage
  var currentAccount = localStorage.getItem('currentAccount')
  //store.dispatch(setCurrentAccount(JSON.parse(currentAccount)))
}
*/

// Localization setup
let language =
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage;

// language would be something like es-ES or es_ES. However we store our files with format es.json or en.json
// therefore retrieve only the first 2 digits
if (language.length > 2) {
  language = language.split("-")[0];
}

T.setTexts(require("../locale/" + language + ".json"));

render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </Provider>,
  document.getElementById("app")
);
