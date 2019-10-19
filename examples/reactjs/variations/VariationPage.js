import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';

import * as Variations from './Variations';


const mapVariations = (fn) => Object.keys(Variations).map(fn);

export const Index = () => {
  const match = useRouteMatch();

  return (
    <ul>
      {
        mapVariations((variation) => {
          return <li key={variation}><Link to={`${match.url}/${variation}`}>{variation}</Link></li>
        })
      }
    </ul>
  )
};

export const VariationPage = () => {
  const match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${match.path}`} exact={true}>
          <Index/>
        </Route>

        {
          mapVariations((variation) => {
            const Variation = Variations[variation];

            return (
              <Route path={`${match.path}/${variation}`} key={variation}>
                <Variation/>
              </Route>
            )
          })
        }
      </Switch>
    </div>
  )
};
