import React from 'react';
import {Link, Route, Switch, useRouteMatch} from 'react-router-dom';

import {fixtures} from "./fixtures";
import {withURLProps} from "./withURLProps/withURLProps";
import {withComponentSourceCode, withPropsDebug} from "./utils";


export const FixturesPage = () => {
  const match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${match.path}`} exact={true}>
          <FixturesList/>
        </Route>

        {
          mapFixtures((fixtureName) => {
            const Fixture = withURLProps(withPropsDebug(withComponentSourceCode(fixtures[fixtureName])));

            return (
              <Route path={`${match.path}/${fixtureName}`} key={fixtureName}>
                <Fixture/>
              </Route>
            )
          })
        }
      </Switch>
    </div>
  )
};

const mapFixtures = (fn) => Object.keys(fixtures).map(fn);

const FixturesList = (props) => {
  const match = useRouteMatch();

  return (
    <ul>
      {
        mapFixtures((fixtureName) => {
          return (
            <li key={fixtureName}>
              <Link to={`${match.path}/${fixtureName}`}>{fixtureName}</Link>
            </li>
          )
        })
      }
    </ul>
  )
};


