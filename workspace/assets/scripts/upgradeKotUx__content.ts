import $ from 'jquery';

type DakokuValue = '1' | '2';

class UpgradeKotUx {
  constructor() {
    this.init();
  }

  private init(): void {
    if (this.isKotTopPage() || this.isDakokuShinseiPage()) {
      this.activateKantanButton();
    }
  }

  private insertPagingButton($todayRow: JQuery<HTMLElement>): void {
    // TODO(baba): イラストレーターから正式な画像が来たら差し替え
    const warotaImage = '<img src="https://emoji.slack-edge.com/T02B138NJ/warota_burburu/9a1c749903d63479.gif">';
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
          width: 240px;
          height: 240px;
          margin: 0;
          border: 0;
          background-color: #005A96;
          color: #FFFFFF;
          font-size: 30px;
          font-weight: bold;
          line-height: 1.25;
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

  private insertDakokuData(dakokuValue: DakokuValue): void {
    const $shukkinSelection = $('select[name=recording_type_code_1]');
    $shukkinSelection.val(dakokuValue);

    const $shukkinTime = $('#recording_timestamp_time_1');
    $shukkinTime.val(this.generateCurrentTimeText());
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
        // TODO(baba): イラストレーターから正式な画像が来たら差し替え
        case '1': return '<img src="https://emoji.slack-edge.com/T02B138NJ/warota_burburu/9a1c749903d63479.gif">';
        case '2': return '<img src="https://emoji.slack-edge.com/T02B138NJ/warota_burburu/9a1c749903d63479.gif">';
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
    const buttonText = `${this.generateCurrentTimeText()}に<br />${generateDakokuPrefix(dakokuValue)}`;
    $button.find('span').prepend(buttonText);
  }

  private generateCurrentTimeText(): string {
    const currentTime = new Date();
    return `00${currentTime.getHours()}`.slice(-2) + ':' + `00${currentTime.getMinutes()}`.slice(-2);
  }

  private isAlreadyArrived(): boolean {
    const $dakokuHistoryTable = $('.specific-table_1000_wrap');
    return $dakokuHistoryTable.length === 1;
  }

  private moveToDakokuShinseiPage($todayRow: JQuery<HTMLElement>): void {
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

  private findTodayRow(): JQuery<HTMLElement> | undefined {
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

    const $tableRows = $('.htBlock-adjastableTableF_inner > table > tbody > tr');
    return $tableRows.eq(matchedRowIndex);
  }
}

new UpgradeKotUx();
