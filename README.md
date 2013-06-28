TaggedLogger
============

A logger frontend for [Winston][winston] that attaches tags to the messages. `TaggedLogger` is meant as a convenience on top of [Winston][winston], not as a logger library in its own right.

All log messages get a timestamp and tags. The tags are used to convey which scope–both static and dynamic–the log message originated in.

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

    // Create a normal winston logger:
    var winstonLogger = new winston.Logger({
        transports: [
            new TaggedConsoleTarget()
        ]
    });

    // Wrap it in a TaggedLogger, the thing we will be using:
    var log = new TaggedLogger(winstonLogger);

    // Use the tagged logger:
    log.info("Logging from the global scope");

    // Use createSublogger to keep track of context:
    subModule(log.createSublogger("submodule"));

    function subModule(log) {
        // Pretend this function is a real module
        log.info("Logging from the submodule");
    }

    log.info("Logging from the global scope again");

Example output:

    05:33:13.222 2013-04-17 Wednesday
    05:33:13.224 [] Logging from the global scope
    05:33:13.224 [submodule] Logging from the submodule
    05:33:13.224 [] Logging from the global scope again

It works fine without `TaggedConsoleTarget`, but the default console target does not know how to format the tags helpfully.

Reference documentation
-----------------------
If you are comfortable with [Winston][winston], reading [the tiny source](https://bitbucket.org/maghoff/tagged-logger/src/tip/index.js) of `TaggedLogger` might be the easiest way to learn its inner workings. Otherwise:

### Instantiation ###
`require('tagged-logger')` returns the constructor `TaggedLogger`. Using `new` is optional; whether or not you use it will yield exactly the same results.

    var logger = new TaggedLogger(winstonLogger);

`winstonLogger` is a logger from the [Winston][winston] library, and all messages logged to this `TaggedLogger` will be passed to this underlying `winstonLogger`. Winston attempts to be unopiniated about the format of these messages. `TaggedLogger` attempts to be opinionated and give all the messages tags and a timestamp.

The logger can alternatively be instantiated with tags–`TaggedLogger(winstonLogger, ['tagA', 'tagB'])`–but these are normally added by calling [`createSublogger`](#createSublogger) on an existing logger.

<div id="log"></div>

### `logger.log(level, message)` ###
Logs `message` to the underlying logger at [log-level](https://github.com/flatiron/winston#logging-levels) `level`.

The log message gets two properties set in its [metadata](https://github.com/flatiron/winston#logging-with-metadata):

 * `timestamp`: The system time at the time of this call
 * `tags`: A list of all the tags the `logger` object has

### `logger.info(message)` ###
This maps directly to [`logger.log('info', message)`](#log) and is included for convenience.

### `logger.warn(message)` ###
This maps directly to [`logger.log('warn', message)`](#log) and is included for convenience.

### `logger.error(message)` ###
This maps directly to [`logger.log('error', message)`](#log) and is included for convenience.

<div id="createSublogger"></div>

### `logger.createSublogger(tag)` ###
Instantiates a new logger object with the same underlying logger and tags as `logger`, plus the additional tag `tag`. Use it when entering a new significant scope, for example in a module of your application (static scope) or on each request in an http server (dynamic scope).

Consider the following module:

    module.exports = function (logger) {
        logger.info("I am the module");
    }

Now, from another scope, we could include this module:

    logger.info("I am in the global scope");
    require("the-module")(logger.createSublogger("the-module"));
    logger.info("I am still in the global scope");

The output would look like this:

    05:33:13.224 [] I am in the global scope
    05:33:13.224 [the-module] I am the module
    05:33:13.224 [] I am still in the global scope

By using this structure, it is easy to determine where the log message originated.


[winston]: https://npmjs.org/package/winston
