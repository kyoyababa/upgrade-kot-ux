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
      .htBlock-buttonL.htBlock-buttonSave.specific-saveButtonBottom:hover {
        background-color: #0A75BD;
      }

      #kantan-dakoku-shinsei:hover > img,
      .htBlock-buttonL.htBlock-buttonSave.specific-saveButtonBottom:hover > img {
        animation: spring 1500ms;
        animation-timing-function: ease;
        animation-iteration-count: infinite;
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

type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type DayChar = '日' | '月' | '火' | '水' | '木' | '金' | '土' | '日';

export function generateTodayText(): string {
  const currentDate = new Date();
  const convertDayToChar = (day: Day): string => {
    const daysEnums: Array<{ code: Day, char: DayChar }> = [
      { code: 0, char: '日' }, { code: 1, char: '月' }, { code: 2, char: '火' }, { code: 3, char: '水' },
      { code: 4, char: '木' }, { code: 5, char: '金' }, { code: 6, char: '土' }
    ];
    const matchedDaysEnum = daysEnums.find(d => day === d.code);
    if (!matchedDaysEnum) return '';
    return `（${matchedDaysEnum.char}）`;
  };
  const date = `${currentDate.getMonth() + 1}<span style="margin: 0 0.125em;">/</span>${currentDate.getDate()}`;
  const day = convertDayToChar(<Day>currentDate.getDay());
  return `<span style="font-feature-settings: 'palt'">${date}${day}</span>`;
}
