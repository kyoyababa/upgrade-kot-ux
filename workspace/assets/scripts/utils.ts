export function getAdditionalStyles(): string {
  return `
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
  `;
}

export function generateCurrentTimeText(): string {
  const currentTime = new Date();
  return `00${currentTime.getHours()}`.slice(-2) + ':' + `00${currentTime.getMinutes()}`.slice(-2);
}
