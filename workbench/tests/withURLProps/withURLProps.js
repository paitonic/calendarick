import React from "react";
import {decodeProps} from "./propsSerializer";


export const withURLProps = (Component) => {
  const queryProps = new URLSearchParams(location.search).get('props');
  let urlProps = {};
  if (queryProps) {
    urlProps = decodeProps(queryProps);
  }

  return (props) => {
    const combinedProps = {...props, ...urlProps};
    return <Component {...combinedProps}/>
  }
};
