import { Fragment } from 'react';
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Alert from "./components/common/Alert";

// Redux
// This package will connect React with Redux
import { Provider } from "react-redux";
import store from "./store/store";

import './App.css';

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />

        {/* To cover entire width */}
        <Route exact path="/" component={ Landing } />

        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/register" component={ Register } />
            <Route exact path="/login" component={ Login } />
          </Switch>
        </section>

      </Fragment>
    </Router>
  </Provider>
);

export default App;