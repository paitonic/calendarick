import ReactDOM from 'react-dom';
import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import calendarickStyles from '../src/core/calendarick.sass';
import {TEST_SUBJECTS_PAGE} from "./routes";
import {TestSubjects} from "./pages/TestSubjects";


const UI = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true}>
          <ul>
            <li>
              <Link to={TEST_SUBJECTS_PAGE}>Test Subjects</Link>
            </li>
          </ul>
        </Route>

        <Route path={TEST_SUBJECTS_PAGE}>
          <TestSubjects/>
        </Route>
      </Switch>
    </Router>
  )
};

ReactDOM.render(<UI/>, document.getElementById('root'));
