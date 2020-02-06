import $ from 'jquery';
import * as Utils from './utils';

type DakokuValue = '1' | '2';

// TODO(baba): イラストレーターから正式な画像が来たら差し替え
const pagingButtonImageSrc = 'https://emoji.slack-edge.com/T02B138NJ/warota_burburu/9a1c749903d63479.gif';
const shukkinButtonImageSrc = 'https://emoji.slack-edge.com/T02B138NJ/warota_burburu/9a1c749903d63479.gif';
const taikinButtonImageSrc = 'https://emoji.slack-edge.com/T02B138NJ/warota_burburu/9a1c749903d63479.gif';

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
    const buttonHtml = `
      <div id="kantan-dakoku-shinsei">
        ${warotaImage}
        <span>今日の<br />申請画面へ</span>
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
    this.convertButtonToWarota(dakokuValue);
  }

  private convertButtonToWarota(dakokuValue: DakokuValue): void {
    this.addButtonStyle();
    this.insertWarotaImageToButton(dakokuValue);
    this.adjustButtonText(dakokuValue);
  }

  private insertWarotaImageToButton(dakokuValue: DakokuValue): void {
    const $button = $('#button_01');
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
    const $button = $('#button_01');
    const generateDakokuPrefix = (dakokuValue: DakokuValue) => {
      switch(dakokuValue) {
        case '1': return '出勤';
        case '2': return '退勤';
        default: return '';
      }
    }
    const buttonText = `${Utils.generateCurrentTimeText()}に<br />${generateDakokuPrefix(dakokuValue)}`;
    $button.find('span').prepend(buttonText);
  }

  private isAlreadyArrived(): boolean {
    const $dakokuHistoryTable = $('.specific-table_1000_wrap');
    return $dakokuHistoryTable.length === 1;
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

    const today = new Date();
    const rowDates = rowInnerTexts.map(t => {
      const month = parseInt(t.split('/')[0], 10);
      const date = parseInt(t.split('/')[1].slice(0, 2), 10);
      const currentYear = today.getFullYear();
      return new Date(currentYear, month, date);
    })
    const matchedRowIndex = rowDates.findIndex(d => {
      const isMonthMatched = d.getMonth() - 1 === today.getMonth();
      const isDateMatched = d.getDate() === today.getDate();
      return isMonthMatched && isDateMatched;
    });
    if (typeof matchedRowIndex === 'undefined' || matchedRowIndex === null) return;

    const $tableRows: JQuery<HTMLTableRowElement> = $('.htBlock-adjastableTableF_inner > table > tbody > tr');
    return $tableRows.eq(matchedRowIndex);
  }
}

new UpgradeKotUx();
