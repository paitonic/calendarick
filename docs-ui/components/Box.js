import React from 'react';


export const Box = (props) => {
  const { children } = props
  return (
    <>
      <div style={props.style}>
        {children}
      </div>
    </>
  )
}
