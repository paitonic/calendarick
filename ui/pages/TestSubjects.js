import React from "react";

import {ComponentViewer} from "../ComponentViewer";
import {withInjectPropsFromURL} from "../withInjectPropsFromURL/withInjectPropsFromURL";
import {components} from "../../cypress/test-subjects";
import inspectorStyles from '../../cypress/inspector.sass';


export const TestSubjects = () => {
  const enhancer = (Component) => withInjectPropsFromURL(Component);

  return (
    <ComponentViewer components={components} enhanceFn={enhancer}/>
  )
};
