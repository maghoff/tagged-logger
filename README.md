TaggedLogger
============

A logger frontend for [Winston](https://npmjs.org/package/winston) that attaches tags to the messages.

This module is designed to work together with [`TaggedConsoleTarget`](https://npmjs.org/package/tagged-console-target).

Install
-------

    npm install tagged-logger

Example
-------

For this example you need to `npm install winston tagged-console-target tagged-logger`.

	var winston = require('winston');
	var TaggedConsoleTarget = require('tagged-console-target');
	var TaggedLogger = require('tagged-logger');

	var winstonLogger = new (winston.Logger)({
		transports: [
			new TaggedConsoleTarget()
		]
	});

	function subModule(log) {
		log.info("Log message 2");
	}

	var log = new TaggedLogger(winstonLogger, ['example']);

	log.info("Log message 1");
	subModule(log.createSublogger("submodule"));

Example output:

	05:33:13.222 2013-04-17 Wednesday
	05:33:13.224 [example] Log message 1
	05:33:13.224 [example, submodule] Log message 2

It works fine without `TaggedConsoleTarget`, but the default console target does not know how to format the tags helpfully.

Reference documentation
-----------------------

Please refer to [the source](https://bitbucket.org/maghoff/tagged-logger/src/tip/index.js).
