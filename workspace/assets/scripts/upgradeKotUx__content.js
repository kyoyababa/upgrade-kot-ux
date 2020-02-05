'use strict';

import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

class UpgradeKotUx {
  constructor() {
    if (this.checkIfKotPageIsCorrect('top')) {
      return this.activateKantanButton();
    }

    if (!this.checkIfKotPageIsCorrect('dakokuShinsei')) {
      return;
    }

    if (this.isAlreadyArrived()) {
      this.doTaikinDakoku();
    } else {
      this.doShukkinDakoku();
    }
  }

  activateKantanButton() {
    const $todayRow = this.findTodayRow();
    if ($todayRow.length === 0) return;

    $('body').append(`
      <div id="kantan-dakoku-shinsei">
        かんたん打刻申請
        <style>
          #kantan-dakoku-shinsei {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: red;
            color: #fff;
            font-size: 24px;
            font-weight: bold;
            line-height: 1;
            padding: 20px;
            border-radius: 4px;
            box-shadow: 0 3px 6px #666;
            cursor: pointer;
            z-index: 9999;
          }
        </style>
      </div>
    `);

    $('#kantan-dakoku-shinsei').click(() => {
      this.moveToDakokuShinseiPage($todayRow);
    });
  }

  doShukkinDakoku() {
    this.doDakoku('1');
  }

  doTaikinDakoku() {
    this.doDakoku('2');
  }

  doDakoku(dakokuValue) {
    const $shukkinSelection = $('select[name=recording_type_code_1]');
    $shukkinSelection.val(dakokuValue);

    const $shukkinTime = $('#recording_timestamp_time_1');
    const currentTime = new Date();
    const currentTimeText = `00${currentTime.getHours()}`.slice(-2) + ':' + `00${currentTime.getMinutes()}`.slice(-2);
    $shukkinTime.val(currentTimeText);

    const $cta = $('#button_01');
    $cta.click();
  }

  isAlreadyArrived() {
    const $dakokuHistoryTable = $('.specific-table_1000_wrap');
    return $dakokuHistoryTable.length === 1;
  }

  moveToDakokuShinseiPage($todayRow) {
    const todayTriggerId = $todayRow.find('.htBlock-selectOther > option').eq(1).val();
    $(todayTriggerId).click();
  }

  checkIfKotPageIsCorrect(pagePattern) {
    if (pagePattern === 'top') {
      const $targetTableWrapper = $('.htBlock-adjastableTableF_inner');
      return $targetTableWrapper.length === 1;
    } else if (pagePattern === 'dakokuShinsei') {
      const $targetTableWrapper = $('#recording_timestamp_table');
      return $targetTableWrapper.length === 1;
    }
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
