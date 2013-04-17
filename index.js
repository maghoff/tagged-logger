function TaggedLogger(target, tags) {
	this.target = target;
	this.tags = tags;
}

TaggedLogger.prototype.log = function (level, msg) {
	this.target.log(level, msg, {timestamp: new Date(), tags: this.tags});
};

TaggedLogger.prototype.info = function (msg) { this.log('info', msg); };
TaggedLogger.prototype.warn = function (msg) { this.log('warn', msg); };
TaggedLogger.prototype.error = function (msg) { this.log('error', msg); };

TaggedLogger.prototype.createSublogger = function (tag) {
	return new TaggedLogger(this.target, this.tags.concat([tag]));
};

module.exports = TaggedLogger;
