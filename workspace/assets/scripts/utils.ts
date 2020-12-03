import $ from 'jquery';

export function getAdditionalStyles(): string {
  return `
    <style>
      #kantan-dakoku-shinsei,
      .htBlock-buttonL.htBlock-buttonSave.specific-saveButtonBottom {
        position: fixed;
        bottom: 30px;
        right: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 240px;
        height: 240px;
        margin: 0;
        padding: 0 !important;
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

      #kantan-dakoku-shinsei > img,
      .htBlock-buttonL.htBlock-buttonSave.specific-saveButtonBottom > img {
        display: block;
        margin-top: -10px;
      }

      #kantan-dakoku-shinsei > img {
        width: 80px;
      }

      .htBlock-buttonL.htBlock-buttonSave.specific-saveButtonBottom > img {
        width: 100px;
      }

      #kantan-dakoku-shinsei > img + *,
      .htBlock-buttonL.htBlock-buttonSave.specific-saveButtonBottom > img + * {
        display: block;
        margin-top: 10px;
      }

      #kantan-dakoku-shinsei:hover,
      #kantan-dakoku-shinsei.hover,
      .htBlock-buttonL.htBlock-buttonSave.specific-saveButtonBottom:hover,
        .htBlock-buttonL.htBlock-buttonSave.specific-saveButtonBottom.hover {
        background-color: #0A75BD;
      }

      #kantan-dakoku-shinsei:hover > img,
      #kantan-dakoku-shinsei.hover > img,
      .htBlock-buttonL.htBlock-buttonSave.specific-saveButtonBottom:hover > img,
      .htBlock-buttonL.htBlock-buttonSave.specific-saveButtonBottom.hover > img {
        animation: spring 1500ms;
        animation-timing-function: ease;
        animation-iteration-count: infinite;
      }

      small.dakoku-key-assist {
        display: block;
        margin-top: 4px;
        font-size: 14px;
      }

      small.dakoku-key-assist > code {
        display: inline-block;
        padding: 0px 4px;
        border: 1px solid rgba(255,255,255,0.75);
        border-radius: 4px;
      }

      /* NOTE(baba): CTAがふたつあるの意味不明で嫌なので非表示 */
      .htBlock-fixedToolbar, .htBlock-fixedToolbar_spacer {
        display: none !important;
      }

      @keyframes spring {
        0% { transform: scale(1) translateY(0); }
        10% { transform: scale(1.2, 0.6); }
        30% { transform: scale(0.8, 1.1) translateY(-40px); }
        50% { transform: scale(1.3, 0.8) translateY(20px); }
        70% { transform: scale(1) translateY(0); }
        100% { transform: translateY(0); }
      }
    </style>
  `;
}

export function generateCurrentTimeText(): string {
  const currentTime = new Date();
  return `00${currentTime.getHours()}`.slice(-2) + ':' + `00${currentTime.getMinutes()}`.slice(-2);
}

export function generateTodayText(): string {
  const currentDate = new Date();
  const date = `${currentDate.getMonth() + 1}<span style="margin: 0 0.125em;">/</span>${currentDate.getDate()}`;
  return date;
}

export function findMatchedRowIndex(rowInnerTexts: Array<string>): number | null {
  const today = new Date();
  const rowDates = rowInnerTexts.map(t => {
    const month = parseInt(t.split('/')[0], 10);
    const date = parseInt(t.split('/')[1].slice(0, 2), 10);
    const currentYear = today.getFullYear();
    return new Date(currentYear, month - 1, date);
  })
  return rowDates.findIndex(d => {
    const isMonthMatched = d.getMonth() === today.getMonth();
    const isDateMatched = d.getDate() === today.getDate();
    return isMonthMatched && isDateMatched;
  });
}

export function getDakokuButton(): JQuery<HTMLButtonElement> {
  return $('.htBlock-buttonL.htBlock-buttonSave.specific-saveButtonBottom');
}
