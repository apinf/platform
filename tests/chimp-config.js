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


// 	// - - - - WEBDRIVER-IO  - - - -
	webdriverio: {
// 		desiredCapabilities: {},
 		logLevel: 'info',
// 		// logOutput: null,
// 		host: '127.0.0.1',
// 		port: 4444,
// 		path: '/wd/hub',
// 		baseUrl: null,
// 		coloredLogs: true,
// 		screenshotPath: null,
// 		waitforTimeout: 500,
// 		waitforInterval: 250,
	},

// 	// - - - - SESSION-MANAGER  - - - -
// 	noSessionReuse: false,

// 	// - - - - MOCHA  - - - -
  mocha: true,
  mochaCommandLineOptions: ['--color'],
  mochaConfig: {
		// tags and grep only work when watch mode is false
    tags: '',
    grep: null,
    timeout: 80000,
    reporter: 'spec',
    slow: 100,
		// retries: 3,
    bail: true, // bail after first test failure
  },

// 	// - - - - METEOR  - - - -
  ddp: 'http://localhost:3000',
 	serverExecuteTimeout: 10000,

// 	// - - - - DEBUGGING  - - - -
 	log: 'info',
 	debug: true,
// 	seleniumDebug: null,
// 	debugCucumber: null,
// 	debugBrkCucumber: null,
 	debugMocha: true,
// 	debugBrkMocha: null,
};
