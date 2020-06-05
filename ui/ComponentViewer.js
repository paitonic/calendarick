import React from "react";
import PropTypes from 'prop-types';
import {Link, Route, Switch, useRouteMatch} from "react-router-dom";

export const ComponentViewer = (props) => {
  const match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${match.path}`} exact={true}>
          <ul>
            {
              Object.keys(props.components).map((componentName) => {
                return (
                  <li key={componentName}>
                    <Link to={`${match.path}/${componentName}`}>{componentName}</Link>
                  </li>
                )
              })
            }
          </ul>
        </Route>

        {
          Object.keys(props.components).map((componentName) => {
            const EnhancedComponent = props.enhanceFn(props.components[componentName]);
            return (
              <Route path={`${match.path}/${componentName}`} key={componentName}>
                <EnhancedComponent/>
              </Route>
            )
          })
        }
      </Switch>
    </div>
  )
};

ComponentViewer.propTypes = {
  components: PropTypes.object,
  enhanceFn: PropTypes.func
};

ComponentViewer.defaultProps = {
  enhanceFn: (component) => component,
};
