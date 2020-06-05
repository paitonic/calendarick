import React, {useEffect, useRef} from "react";
import clsx from "clsx";

import {useClickAway, useWatchChanges} from "../hooks";


export function Dialog(props) {
  const dialogRef = useRef(null);
  const [isShown, setIsShown] = useClickAway(dialogRef, props.onClickAway);

  useWatchChanges(() => {
    props.onChange(isShown);
  }, [isShown]);

  useWatchChanges(() => {
    setIsShown(props.isShown);
  }, [props.isShown]);

  return (
    <>
      {
        <div className={clsx('calendarick-dialog', {'calendarick-dialog--closed': !isShown})}
             ref={dialogRef}
             data-test-id="dialog">
          {props.children}
        </div>

      }

      {
        isShown &&
        <div className="calendarick-dialog__backdrop" data-test-id="dialog__backdrop"></div>
      }
    </>
  )
}
