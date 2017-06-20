/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */


module.exports = {

  showXolvioMessages: false,

  path: 'tests/end-to-end',
  screenshotsOnError: true,
  screenshotsPath: '.screenshots',
  captureAllStepScreenshots: false,
  saveScreenshotsToDisk: true,

  mocha: true,
  mochaCommandLineOptions: ['--color'],
  mochaConfig: {
    tags: '',
    grep: '', // Change to '03' for testing the 03-user-creation.js file
    timeout: 80000,
    reporter: 'spec',
    slow: 100,
    bail: true, // bail after first test failure
  },

  ddp: 'http://localhost:3000',
  serverExecuteTimeout: 10000,

  // - - - - DEBUGGING  - - - -
  // Uncomment 2 lines below to print everything
	// log: 'info',
	// debug: true,
};
