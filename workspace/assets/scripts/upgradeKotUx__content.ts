import $ from 'jquery';
import * as Utils from './utils';

type DakokuValue = '1' | '2';

const pagingButtonImageSrc = chrome.extension.getURL('assets/images/kintai-kun.png');
const shukkinButtonImageSrc = chrome.extension.getURL('assets/images/shukkin-kun.png');
const taikinButtonImageSrc = chrome.extension.getURL('assets/images/taikin-kun.png');

class UpgradeKotUx {
  constructor() {
    this.init();
  }

  private init(): void {
    if (this.isKotTopPage() || this.isDakokuShinseiPage()) {
      this.activateKantanButton();
    }
  }

  private insertPagingButton($todayRow: JQuery<HTMLTableRowElement>): void {
    const warotaImage = `<img src="${pagingButtonImageSrc}">`;
    const todayText = Utils.generateTodayText();
    const buttonHtml = `
      <div id="kantan-dakoku-shinsei">
        ${warotaImage}
        <span>
          ${todayText}の<br />
          申請画面へ
        </span>
      </div>
    `;
    $('body').append(buttonHtml);
    $('#kantan-dakoku-shinsei').click(() => {
      this.moveToDakokuShinseiPage($todayRow);
    });
  }

  private activateKantanButton(): void {
    if (this.isKotTopPage()) {
      const $todayRow = this.findTodayRow();
      if (typeof $todayRow === 'undefined' || $todayRow.length === 0) return;

      this.addButtonStyle();
      this.insertPagingButton($todayRow);
      return;
    }

    if (this.isDakokuShinseiPage() && this.isAlreadyArrived()) {
      this.insertTaikinDakokuData();
      return;
    }

    if (this.isDakokuShinseiPage()) {
      this.insertShukkinDakokuData();
      return;
    }
  }

  private insertShukkinDakokuData(): void {
    this.insertDakokuData('1');
  }

  private insertTaikinDakokuData(): void {
    this.insertDakokuData('2');
  }

  private addButtonStyle(): void {
    $('body').append(Utils.getAdditionalStyles());
  }

  private insertDakokuData(dakokuValue: DakokuValue): void {
    const $shukkinSelection = $('select[name=recording_type_code_1]');
    $shukkinSelection.val(dakokuValue);

    const $shukkinTime = $('#recording_timestamp_time_1');
    $shukkinTime.val(Utils.generateCurrentTimeText());
    // NOTE(baba): フォーカスしないとModelがBindingされないため下記を実行
    $shukkinTime.focus();
    $shukkinTime.blur();
    this.convertButtonToWarota(dakokuValue);
  }

  private convertButtonToWarota(dakokuValue: DakokuValue): void {
    this.addButtonStyle();
    this.insertWarotaImageToButton(dakokuValue);
    this.adjustButtonText(dakokuValue);
  }

  private insertWarotaImageToButton(dakokuValue: DakokuValue): void {
    const $button = Utils.getDakokuButton();
    const generateWarotaImage = (dakokuValue: DakokuValue) => {
      switch(dakokuValue) {
        case '1': return `<img src="${shukkinButtonImageSrc}">`;
        case '2': return `<img src="${taikinButtonImageSrc}">`;
      }
    }
    const warotaImage = generateWarotaImage(dakokuValue);
    $button.prepend(warotaImage);
  }

  private adjustButtonText(dakokuValue: DakokuValue): void {
    const $button = Utils.getDakokuButton();
    const generateDakokuPrefix = (dakokuValue: DakokuValue) => {
      switch(dakokuValue) {
        case '1': return '出勤';
        case '2': return '退勤';
      }
    }
    const time = `<span style="letter-spacing: 0.05em;">${Utils.generateCurrentTimeText()}</span>`;
    const buttonText = `${time}<br />に${generateDakokuPrefix(dakokuValue)}`;
    $button.find('span').html(buttonText);

    this.startWatchingChangeValues();
  }

  private isAlreadyArrived(): boolean {
    const $dakokuHistoryTable = $('.specific-table_1000_wrap');
    const $rows = $('#recording_timestamp_table tbody tr:not(#recording_timestamp_add_template)');
    const isArrived = Array.from($rows).map($r => {
      return $($r).find('select.htBlock-selectmenu').val() === '1';
    }).includes(true);
    return $dakokuHistoryTable.length === 1 || isArrived;
  }

  private moveToDakokuShinseiPage($todayRow: JQuery<HTMLTableRowElement>): void {
    const $option = $todayRow.find('.htBlock-selectOther > option').eq(1);
    const todayTriggerId = $option.val();
    if (typeof todayTriggerId === 'undefined') return;
    $(<string>todayTriggerId).click();
  }

  private isKotTopPage(): boolean {
    const $targetTableWrapper = $('.htBlock-adjastableTableF_inner');
    return $targetTableWrapper.length === 1;
  }

  private isDakokuShinseiPage(): boolean {
    const $targetTableWrapper = $('#recording_timestamp_table');
    return $targetTableWrapper.length === 1;
  }

  private findTodayRow(): JQuery<HTMLTableRowElement> | undefined {
    const $dayRows = $('.htBlock-scrollTable_day');
    const rowInnerTexts = Array.from($dayRows).map($r => {
      return $($r).find('p').text();
    });

    const matchedRowIndex = Utils.findMatchedRowIndex(rowInnerTexts);
    if (typeof matchedRowIndex === 'undefined' || matchedRowIndex === null) return;

    const $tableRows: JQuery<HTMLTableRowElement> = $('.htBlock-adjastableTableF_inner > table > tbody > tr');
    return $tableRows.eq(matchedRowIndex);
  }

  // NOTE(baba): ユーザーが任意の値で打刻申請をしたい場合を考慮し、
  // 何らかの値の編集が行われたらボタンを汎用化する
  private startWatchingChangeValues(): void {
    const $types = $('select[name^="recording_type_code_"]');
    const $times = $('input[name^="recording_timestamp_time_"]');
    const $button = Utils.getDakokuButton();

    const changeButtonText = () => {
      $button.children('span').eq(0).text('打刻申請');
    };

    $types.change(() => changeButtonText());
    $times.change(() => changeButtonText());
  }
}

new UpgradeKotUx();
