import Clipboard from "clipboard";

Template.viewApiBackendDetails.onRendered(function () {

  // Initialize Clipboard copy button
  let copyButton = new Clipboard("#copyApiUrl");

  // Tooltip position
  $('#copyApiUrl').tooltip({
    trigger: 'click',
    placement: 'bottom'
  });

  // Tell the user when copy is successful
  copyButton.on("success", function () {
    $('#copyApiUrl').tooltip('hide')
      .attr('data-original-title', 'Copied!')
      .tooltip('show');
  });
});
