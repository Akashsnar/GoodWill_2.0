import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { createStore } from "redux";
import auth from "./redux/features/auth";
import thunk from "redux-thunk";
export const store = createStore(auth, compose(applyMiddleware(thunk)));

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Provider loading={null} store={store}>
        <App />
      </Provider>
    </Provider>
  </React.StrictMode>
);
