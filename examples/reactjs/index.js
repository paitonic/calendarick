import ReactDOM from 'react-dom';
import React from 'react';

import { TestsPage } from './TestsPage';
import { DevelopmentPage } from './DevelopmentPage';

function App(props) {
  return (
    <ul>
      <li>
        <a href="development">Development</a>
      </li>

      <li>
        <a href="tests">Tests</a>
      </li>
    </ul>
  )
}

const routes = {
  "/": <App/>,
  "/development": <DevelopmentPage/>,
  "/tests": <TestsPage/>,
};

const matchRoute = () => {
  return routes[location.pathname];
};


ReactDOM.render(matchRoute(), document.getElementById('root'));
