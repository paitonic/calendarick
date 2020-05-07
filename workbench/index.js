import ReactDOM from 'react-dom';
import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import { FixturesPage } from './tests/FixturesPage';


function Index(props) {
  return (
    <ul>
      <li>
        <Link to="/fixtures">Fixtures</Link>
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

        <Route path="/fixtures">
          <FixturesPage/>
        </Route>
      </Switch>
    </Router>
  )
};

ReactDOM.render(<Playground/>, document.getElementById('root'));
