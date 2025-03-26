const Logger = require('pizza-logger');
const config = require('./config.js');
const logger = new Logger(config);

class StatusCodeError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		logger.unhandledErrorLogger(this);
	}
}

const asyncHandler = (fn) => (req, res, next) => {
	return Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
	asyncHandler,
	StatusCodeError,
};
