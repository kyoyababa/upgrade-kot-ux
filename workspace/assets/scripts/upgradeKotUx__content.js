'use strict';

import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

class UpgradeKotUx {
  constructor() {
    if (this.checkIfKotPageIsTop() || this.checkIfKotPageIsDakokuShinsei()) {
      this.activateKantanButton();
    }
  }

  generateButton(buttonText) {
    const warotaImage = '<img src="https://emoji.slack-edge.com/T02B138NJ/warota_burburu/9a1c749903d63479.gif">';
    return `
      <div id="kantan-dakoku-shinsei">
        ${warotaImage}
        ${buttonText}
        ${warotaImage}
      </div>
    `;
  }

  activateKantanButton() {
    if (this.checkIfKotPageIsTop()) {
      const $todayRow = this.findTodayRow();
      if ($todayRow.length === 0) return;

      this.addButtonStyle();
      $('body').append(this.generateButton('今日の<br />打刻申請画面へ'));
      $('#kantan-dakoku-shinsei').click(() => {
        this.moveToDakokuShinseiPage($todayRow);
      });
    }

    if (this.checkIfKotPageIsDakokuShinsei() && this.isAlreadyArrived()) {
      this.addButtonStyle();
      this.insertTaikinDakokuData();
    }

    if (this.checkIfKotPageIsDakokuShinsei()) {
      this.insertShukkinDakokuData();
    }
  }

  insertShukkinDakokuData() {
    this.insertDakokuData('1');
  }

  insertTaikinDakokuData() {
    this.insertDakokuData('2');
  }

  addButtonStyle() {
    $('body').append(`
      <style>
        #kantan-dakoku-shinsei, #button_01 {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          width: 200px;
          height: 200px;
          margin: 0;
          border: 0;
          background-color: #005A96;
          color: #FFFFFF;
          font-size: 24px;
          font-weight: bold;
          line-height: 1;
          padding: 20px;
          border-radius: 100%;
          box-shadow: 0 3px 6px #666666;
          text-align: center;
          cursor: pointer;
          z-index: 9999;
          transition: background-color 300ms cubic-bezier(0.19,1,0.22,1);
        }

        #kantan-dakoku-shinsei > img {
          display: block;
          width: 50px;
          height: 50px;
        }

        #kantan-dakoku-shinsei:hover, #button_01:hover {
          background-color: #0A75BD;
        }
      </style>
    `);
  }

  insertDakokuData(dakokuValue) {
    const $shukkinSelection = $('select[name=recording_type_code_1]');
    $shukkinSelection.val(dakokuValue);

    const $shukkinTime = $('#recording_timestamp_time_1');
    const currentTime = new Date();
    const currentTimeText = `00${currentTime.getHours()}`.slice(-2) + ':' + `00${currentTime.getMinutes()}`.slice(-2);
    $shukkinTime.val(currentTimeText);
    // NOTE(baba): フォーカスしないとModelがBindingされないため下記を実行
    $shukkinTime.focus();

    const $cta = $('#button_01');
    this.addButtonStyle();
  }

  isAlreadyArrived() {
    const $dakokuHistoryTable = $('.specific-table_1000_wrap');
    return $dakokuHistoryTable.length === 1;
  }

  moveToDakokuShinseiPage($todayRow) {
    const todayTriggerId = $todayRow.find('.htBlock-selectOther > option').eq(1).val();
    $(todayTriggerId).click();
  }

  checkIfKotPageIsTop() {
    const $targetTableWrapper = $('.htBlock-adjastableTableF_inner');
    return $targetTableWrapper.length === 1;
  }

  checkIfKotPageIsDakokuShinsei() {
    const $targetTableWrapper = $('#recording_timestamp_table');
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
