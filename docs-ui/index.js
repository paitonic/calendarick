import ReactDOM from 'react-dom';
import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {MDXProvider} from '@mdx-js/react'

import styles from './lazystyle.css';
import calendarickStyles from '../src/core/calendarick.sass';
import { CodeBlock } from "./components/CodeBlock";
import Index from './pages/index.mdx';
import StaticDatePicker from './pages/StaticDatePicker.mdx';
import DialogDatePicker from './pages/DialogDatePicker.mdx';
import Examples from './pages/Examples.mdx';

const UI = () => {
  const components = {
    code: props => <CodeBlock {...props}/>,
  }

  return (
    <MDXProvider components={components}>
      <Router basename='/calendarick'>
        <Switch>
          <Route path="/" exact={true}>
            <Index/>
          </Route>

          <Route path="/StaticDatePicker">
            <StaticDatePicker/>
          </Route>

          <Route path="/DialogDatePicker">
            <DialogDatePicker/>
          </Route>

          <Route path="/examples">
            <Examples/>
          </Route>
        </Switch>
      </Router>
    </MDXProvider>
  )
};

ReactDOM.render(<UI/>, document.getElementById('root'));
