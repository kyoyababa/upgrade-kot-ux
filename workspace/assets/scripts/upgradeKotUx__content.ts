import $ from 'jquery';
import * as Utils from './utils';
import * as i18n from './i18n';

type DakokuValue = '1' | '2';

const pagingButtonImageSrc = chrome.extension.getURL('assets/images/kintai-kun.png');
const shukkinButtonImageSrc = chrome.extension.getURL('assets/images/shukkin-kun.png');
const taikinButtonImageSrc = chrome.extension.getURL('assets/images/taikin-kun.png');

class UpgradeKotUx {
  constructor() {
    this.init();
  }

  private init(): void {
    this.activateKantanButton();

    chrome.storage.onChanged.addListener(_ => {
      if (this.isKotTopPage()) {
        this.adjustMainBtnText();
        return;
      }

      if (this.isDakokuShinseiPage() && this.isAlreadyArrived()) {
        this.adjustButtonText('2');
        return;
      }

      if (this.isDakokuShinseiPage()) {
        this.adjustButtonText('1');
        return;
      }
    });
  }

  private insertPagingButton($todayRow: JQuery<HTMLTableRowElement>): void {
    const warotaImage = `<img src="${pagingButtonImageSrc}">`;
    const todayText = Utils.generateTodayText();
    const buttonHtml = `
      <div id="kantan-dakoku-shinsei">
        ${warotaImage}
        <span style="font-feature-settings: 'palt'">
          ${todayText}<span id="kantan-dakoku-shinsei-day"></span><br />
          <span id="kantan-dakoku-shinsei-text"></span>
          <small class="dakoku-key-assist"><code>Shift</code> + <code>Enter</code></small>
        </span>
      </div>
    `;
    $('body').append(buttonHtml);
    $('#kantan-dakoku-shinsei').click(() => {
      this.moveToDakokuShinseiPage($todayRow);
    });
    $(document).keypress((e) => {
    	if (e.shiftKey && e.charCode === 13) {
        $('#kantan-dakoku-shinsei').addClass('hover');
        $('#kantan-dakoku-shinsei').click();
      }
    });

    this.adjustMainBtnText();
  }

  private adjustMainBtnText() {
    i18n.getMessage('mainBtn', (msg: string) => {
      $('#kantan-dakoku-shinsei-text').text(msg);
    });
    i18n.getMessage(`day${new Date().getDay()}`, (msg: string) => {
      $('#kantan-dakoku-shinsei-day').text(`${msg}`);
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

    if (this.isLoginPage()){
      const $targetLoginButton = $('#login_button');
      this.insertGeneralButton(
          $targetLoginButton.val()?.toString() ?? "ログイン",
          () => $targetLoginButton.trigger('click'))
      return;
    }

    if (this.isDialogPage()){
      const $targetDialogYesButton = $('.htBlock-dialog_yes');
      this.insertGeneralButton(
          $targetDialogYesButton.text(),
          () => $targetDialogYesButton.trigger('click'))
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
    i18n.getMessage(`dakokuBtn${dakokuValue}`, (msg: string) => {
      const time = `<span style="letter-spacing: 0.05em;">${Utils.generateCurrentTimeText()}</span>`;
      const buttonText = `${time}<br />${msg}`;
      const dakokuKeyAssist = '<small class="dakoku-key-assist"><code>Shift</code> + <code>Enter</code></small>';
      $button.find('span').html(buttonText + dakokuKeyAssist);

      this.startWatchingChangeValues();

      $(document).keypress((e) => {
      	if (e.shiftKey && e.charCode === 13) {
          $('.htBlock-buttonL.htBlock-buttonSave.specific-saveButtonBottom').addClass('hover');
          $('htBlock-buttonL.htBlock-buttonSave.specific-saveButtonBottom').click();
        }
      });
    });
  }

  private insertGeneralButton(buttonText: string, callback: () => void): void {
    this.addButtonStyle();
    const buttonHtml = `
      <div id="kantan-dakoku-shinsei">
        ${buttonText}
      </div>
    `;
    $('body').append(buttonHtml);
    $('#kantan-dakoku-shinsei').click(() => {
      callback();
    });
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

  private isLoginPage(): boolean {
    const $targetLoginForm = $('.specific-loginForm');
    return $targetLoginForm.length === 1;
  }

  private isDialogPage(): boolean {
    const $targetDialog = $('.htBlock-dialog');
    return $targetDialog.length === 1;
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
      i18n.getMessage('dakokuBtnGen', (msg: string) => {
        $button.children('span').eq(0).text(msg);
      });
    };

    $types.change(() => changeButtonText());
    $times.change(() => changeButtonText());
  }
}

new UpgradeKotUx();
