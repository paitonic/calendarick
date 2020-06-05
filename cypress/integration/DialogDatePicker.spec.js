import React from "react";

import {render, defaultProps, format, getJSON, tid, toDate} from "../utils";
import {
  d_01,
  d_02,
  d_03,
  d_04,
  d_05,
  d_2020_01_01,
  tid_footer,
  tid_test_output,
  today
} from "../constants";
import {
  assertDayIsChosen, assertDayIsHighlighted,
  assertDayIsNotChosen,
  assertDayIsNotHighlighted,
  assertDialogIsClosed,
  assertDialogIsOpen,
  assertInputIs,
  assertInputIsEmpty,
} from "../assertions";
import {cancel, chooseDay, clickDateInput, mouseOver, ok} from "../actions";
import {DialogDatePicker} from "../test-subjects/DialogDatePicker";
import {DialogDatePickerWithRangeSelection} from "../test-subjects/DialogDatePickerWithRangeSelection";
import {DialogDatePickerWithMultiSelection} from "../test-subjects/DialogDatePickerWithMultiSelection";
import {DialogDatePickerWithDateInput} from "../test-subjects/DialogDatePickerWithDateInput";
import {DialogDateRangePickerWithDateInput} from "../test-subjects/DialogDateRangePickerWithDateInput";


describe(DialogDatePicker.name, () => {
  const props = {
    ...defaultProps,
    selectionMode: 'single',
  };

  it('should render dialog closed on start', () => {
    render(DialogDatePicker.name, props);

    assertDialogIsClosed();
  });

  it('should render input empty on start', () => {
    render(DialogDatePicker.name, props);

    assertInputIsEmpty();
  });

  it('should open dialog', () => {
    render(DialogDatePicker.name, props);

    clickDateInput();
    assertDialogIsOpen();
  });

  it('should close dialog when clicking on cancel button', () => {
    render(DialogDatePicker.name, props);

    clickDateInput();
    assertDialogIsOpen();
    cancel();
    assertDialogIsClosed();
  });

  it('should select date, close dialog and show the date in the input field', () => {
    render(DialogDatePicker.name, {...props, isAutoClosed: true});

    clickDateInput();
    chooseDay(d_01);

    assertDialogIsClosed();
    assertInputIs(format(d_01));
  });

  it('should select date and save changes when OK is clicked', () => {
    render(DialogDatePicker.name, {...props, isAutoClosed: false});

    clickDateInput();
    chooseDay(d_01);
    assertDialogIsOpen();

    ok();
    assertDialogIsClosed();
    assertInputIs(format(d_01));
  });

  it('should overwrite previous date', () => {
    render(DialogDatePicker.name, {...props, isAutoClosed: false});

    clickDateInput();
    chooseDay(d_01);
    ok();

    clickDateInput();
    chooseDay(d_02);
    ok();

    assertDialogIsClosed();
    assertInputIs(format(d_02));
  });

  it('should cancel selection', () => {
    render(DialogDatePicker.name, {...props, isAutoClosed: false});


    clickDateInput();
    chooseDay(d_01);

    cancel();
    assertDialogIsClosed();
    assertInputIsEmpty();
  });

  it('should revert to previous date on cancel', () => {
    render(DialogDatePicker.name, {...props, isAutoClosed: false});

    clickDateInput();
    chooseDay(d_01);
    ok();

    clickDateInput();
    chooseDay(d_02);
    cancel();

    assertDialogIsClosed();
    assertInputIs(format(d_01));
  });

  it('should render footer', () => {
    render(DialogDatePicker.name, {...props, isAutoClosed: false});

    clickDateInput();
    cy.get(tid_footer);
  });

  it('should hide footer', () => {
    render(DialogDatePicker.name, {...props, isAutoClosed: true});

    clickDateInput();
    cy.get(tid_footer).should('not.exist');
  });

  it('should exit dialog on click away', () => {
    render(DialogDatePicker.name, props);

    clickDateInput();
    cy.get('body').click({force: true});

    assertDialogIsClosed();
  });

  it('should extract date from test-output', () => {
    render(DialogDatePicker.name, {...props, value: [ today ]});

    cy.get(tid_test_output).should((element) => {
      const date = new Date(getJSON(element));
      expect(format(date)).to.eql(format(today));
    });
  });

  it('should call onChange callback', () => {
    render(DialogDatePicker.name, {...props, value: [ d_01 ]});

    cy.get(tid_test_output).should((element) => {
      const date = new Date(getJSON(element));
      expect(format(date)).to.eql(format(d_01));
    });

    clickDateInput();
    chooseDay(d_02);
    ok();

    cy.get(tid_test_output).should((element) => {
      const date = new Date(getJSON(element));
      expect(format(date)).to.eql(format(d_02));
    });
  });
});

describe('DialogDatePicker - Range', () => {
  const props = {
    ...defaultProps,
    selectionMode: 'range',
  };

  it('should select range of dates', () => {
    render(DialogDatePickerWithRangeSelection.name, props);

    clickDateInput();
    chooseDay(d_02);
    chooseDay(d_04);

    assertDayIsChosen(d_02, d_03, d_04);
    assertDayIsNotChosen(d_01, d_05);

    ok();
    assertInputIs(`${format(d_02)} - ${format(d_04)}`);

    cy.get(tid_test_output).should((element) => {
      const value = toDate(getJSON(element));
      expect(value.length !== 0).to.eq(true);

      const [ [start, end] ] = value;
      expect(format(start)).to.eql(format(d_02));
      expect(format(end)).to.eql(format(d_04));
    });
  });

  it('should cancel selection of date range', () => {
    render(DialogDatePickerWithRangeSelection.name, props);

    clickDateInput();
    chooseDay(d_02);
    chooseDay(d_04);

    cancel();
    assertInputIsEmpty();

    cy.get(tid_test_output).should((element) => {
      const value = getJSON(element);
      expect(value).to.eq(undefined);
    });
  });

  it('should show trail when selecting end date', () => {
    render(DialogDatePickerWithRangeSelection.name, props);

    clickDateInput();

    chooseDay(d_02);
    mouseOver(d_04);
    assertDayIsHighlighted(d_03);

    mouseOver(d_05);
    assertDayIsHighlighted(d_03, d_04);

    mouseOver(d_04);
    assertDayIsHighlighted(d_03);
    assertDayIsNotHighlighted(d_05);
  });
});

describe('DialogDatePicker - Multi-Selection', () => {
  const props = {
    ...defaultProps,
    selectionMode: 'multiple',
  };

  it('should select multiple dates', () => {
    render(DialogDatePickerWithMultiSelection.name, props);
    clickDateInput();
    chooseDay(d_02);
    chooseDay(d_04);

    assertDayIsChosen(d_02, d_04);
    assertDayIsNotChosen(d_01, d_03, d_05);

    ok();
    assertInputIs(`${format(d_02)}, ${format(d_04)}`);
    cy.get(tid_test_output).should((element) => {
      const value = toDate(getJSON(element));
      expect(value.length !== 0).to.eq(true);

      const [ chosen_d_02, chosen_d_04 ] = value;
      expect(format(chosen_d_02)).to.eql(format(d_02));
      expect(format(chosen_d_04)).to.eql(format(d_04));
    });
  });

  it('should cancel selection of multiple dates', () => {
    render(DialogDatePickerWithMultiSelection.name, props);

    clickDateInput();
    chooseDay(d_02);
    chooseDay(d_04);

    cancel();
    assertInputIsEmpty();

    cy.get(tid_test_output).should((element) => {
      const value = getJSON(element);
      expect(value).to.eq(undefined);
    });
  });
});

describe('DialogDatePicker - DateInput', () => {
  const props = {
    ...defaultProps,
    selectionMode: 'single'
  };

  const dateInput = tid('date-input');
  const openButton = tid('date-input-open-button');
  const clickOpenButton = () => cy.get(openButton).click();

  it('should open the dialog on "open" button click', () => {
    render(DialogDatePickerWithDateInput.name, props);

    assertDialogIsClosed();
    clickOpenButton();
    assertDialogIsOpen();
  });

  it('should synchronize input value with the dialog', () => {
    render(DialogDatePickerWithDateInput.name, props);
    cy.get(dateInput).type('2020-01-01');
    clickOpenButton();
    assertDayIsChosen(d_2020_01_01);
  });

  it('should synchronize value selected in the dialog with the input field', () => {
    render(DialogDatePickerWithDateInput.name, props);
    clickOpenButton();
    chooseDay(d_01);
    ok();
    cy.get(dateInput).should('have.value', format(d_01));
  });

  it('should cancel date selection', () => {
    render(DialogDatePickerWithDateInput.name, props);
    clickOpenButton();
    chooseDay(d_01);
    cancel();
    cy.get(dateInput).should('have.value', '');
  });

  it.skip('should select range of dates', () => {
    // TODO: what happens if user enters 2020-01-03 - 2020-01-01
    // should dates be switched? should date picker know how to work with this?
  });
});

describe('DialogDatePicker - DateInput - Range', () => {
  const props = {
    ...defaultProps,
    selectionMode: 'range',
  };

  const dateRangeInput = tid('date-range-input');
  const openButton = tid('date-input-open-button');
  const clickOpenButton = () => cy.get(openButton).click();

  it('should open the dialog on "open" button click', () => {
    render(DialogDateRangePickerWithDateInput.name, props);

    assertDialogIsClosed();
    clickOpenButton();
    assertDialogIsOpen();
  });

  it('should synchronize input value with the date picker', () => {
    render(DialogDateRangePickerWithDateInput.name, props);

    cy.get(dateRangeInput).type(`${format(d_01)} - ${format(d_03)}`);
    clickOpenButton();
    assertDayIsChosen(d_01, d_02, d_03);
  });

  it('should synchronize value selected in the date picker with the input field', () => {
    render(DialogDateRangePickerWithDateInput.name, props);

    clickOpenButton();
    chooseDay(d_01);
    chooseDay(d_03);
    ok();

    cy.get(dateRangeInput).should('have.value', `${format(d_01)} - ${format(d_03)}`);
  });

  it('should cancel date selection', () => {
      render(DialogDateRangePickerWithDateInput.name, props);

      clickOpenButton();
      chooseDay(d_01);
      chooseDay(d_03);
      cancel();

      cy.get(dateRangeInput).should('have.value', '');
  });
});
