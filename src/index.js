import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { DevelopmentPage } from './DevelopmentPage';
import { VariationPage } from './variations/VariationPage';

function Index(props) {
  return (
    <ul>
      <li>
        <Link to="/development">Development</Link>
      </li>

      <li>
        <Link to="/variations">Variations</Link>
      </li>
    </ul>
  )
}

const Playground = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true}>
          <Index/>
        </Route>

        <Route path="/development">
          <DevelopmentPage/>
        </Route>

        <Route path="/variations">
          <VariationPage/>
        </Route>
      </Switch>
    </Router>
  )
};

ReactDOM.render(<Playground/>, document.getElementById('root'));
