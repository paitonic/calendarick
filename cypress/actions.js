import {tid_cancelButton, tid_dateInput, tid_okButton} from "./constants";
import {format, tid} from "./utils";

export const clickDateInput = () => cy.get(tid_dateInput).click({force: true});
export const ok = () => cy.get(tid_okButton).click();
export const cancel = () => cy.get(tid_cancelButton).click();
export const chooseDay = (day) => cy.get(tid(format(day))).click();
export const clickLeftArrow = () => cy.get(tid('button-left')).click();
export const clickRightArrow = () => cy.get(tid('button-right')).click();
export const mouseOver = (day) => cy.get(tid(format(day))).trigger('mouseover');
