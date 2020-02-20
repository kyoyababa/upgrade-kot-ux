import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

chrome.storage.sync.get(['lang'], result => {
  $(`input[name="lang"][value="${result.lang}"]`).attr('checked', true);
});

$('input[name="lang"]').change(() => {
  const newLangVal = $('input[name="lang"]:checked').val();
  chrome.storage.sync.set({ lang: newLangVal });
  window.close();
});
