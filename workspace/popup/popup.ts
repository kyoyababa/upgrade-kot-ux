import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

chrome.storage.sync.get(['lang'], result => {
  $(`input[name="lang"][value="${result.lang}"]`).attr('checked', true);
});

$('input[name="lang"]').change(() => {
  chrome.storage.sync.set({ "lang": $('input[name="lang"]:checked').val() });
  window.close();
});
