'use strict';

import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

class UpgradeKotUx {
  constructor() {
    if (!this.checkIfKotPageIsCorrect()) return;

    const $todayRow = this.findTodayRow();
    if ($todayRow.length === 0) return;

    // TODO(baba): こいつをクリックしたことにしたい
    // $todayRow.find('.htBlock-selectOther > option')[1]
  }

  checkIfKotPageIsCorrect() {
    const $targetTableWrapper = $('.htBlock-adjastableTableF_inner');
    return $targetTableWrapper.length === 1;
  }

  findTodayRow() {
    const $dayRows = $('.htBlock-scrollTable_day');
    const rowInnerTexts = Array.from($dayRows).map($r => {
      return $($r).find('p').text();
    });
    const today = new Date();
    const rowDates = rowInnerTexts.map(t => {
      const month = t.split('/')[0];
      const date = t.split('/')[1].slice(0, 2);
      const currentYear = today.getFullYear();
      return new Date(currentYear, month, date);
    })
    const matchedRowIndex = rowDates.findIndex(d => {
      const isMonthMatched = d.getMonth() - 1 === today.getMonth();
      const isDateMatched = d.getDate() === today.getDate();
      return isMonthMatched && isDateMatched;
    });
    if (typeof matchedRowIndex === 'undefined' || matchedRowIndex === null) return;

    const $tableRows = $('.htBlock-adjastableTableF_inner > table > tbody > tr');
    return $tableRows.eq(matchedRowIndex);
  }
}

new UpgradeKotUx();

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
});
