import {fromArray} from "../src/core/calendar";
import {tid} from "./utils";

export const today = new Date();

export const tid_today = tid(today);
export const d_01 = fromArray([today.getFullYear(), today.getMonth()+1, 1]);
export const d_02 = fromArray([today.getFullYear(), today.getMonth()+1, 2]);
export const d_03 = fromArray([today.getFullYear(), today.getMonth()+1, 3]);
export const d_04 = fromArray([today.getFullYear(), today.getMonth()+1, 4]);
export const d_05 = fromArray([today.getFullYear(), today.getMonth()+1, 5]);
export const d_2020_01_01 = fromArray([2020, 1, 1]);

export const tid_01 = tid(d_01);
export const tid_02 = tid(d_02);
export const tid_03 = tid(d_03);
export const tid_04 = tid(d_04);
export const tid_05 = tid(d_05);
export const tid_2020_01_01 = tid(d_2020_01_01);

export const tid_dialog = tid('dialog');
export const tid_okButton = tid('dialog__action--ok');
export const tid_cancelButton = tid('dialog__action--cancel');
export const tid_dateInput = tid('dialog__date-input');
export const tid_footer = tid('dialog__footer');
export const tid_debug_pane = tid('debug-pane');
export const tid_test_output = tid('test-output');
