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

export const WithURLProps = (Component) => {
  const queryProps = new URLSearchParams(location.search).get('props');
  let urlProps = {};
  if (queryProps) {
    urlProps = JSON.parse(decodeURIComponent(queryProps));
  }

  return (props) => {
    const overriddenProps = {...props, ...urlProps};
    return <Component {...overriddenProps}/>
  }
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
            const Variation = WithURLProps(Variations[variation]);

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
