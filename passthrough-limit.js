const util = require("util");
const Transform = require("stream").Transform;

const ERR_LIMIT_MSG = "stream too large";
const ERR_LIMIT_STATUS = 413;

var Limit = function (options) {
    if (!(this instanceof Limit)) {
        return new Limit(options);
    }

    if (typeof options === "number") {
        this.limit = options;
        options = {};
    } else {
        options = options || {};
        this.limit = options.limit || 0;
        delete options.limit;
    }

    Transform.call(this, options);
    this.length = 0;
};
Limit.prototype._transform = function (chunk, encoding, callback) {
    this.length += chunk.length;
    this.push(chunk);
    let err = null;
    if (this.limit && this.length > this.limit) {
        this.limit = 0; // prevent further error
        err = new Error(ERR_LIMIT_MSG);
        err.status = ERR_LIMIT_STATUS;
    }
    callback(err);
};

util.inherits(Limit, Transform);

module.exports = Limit;
module.exports.ERR_LIMIT = ERR_LIMIT_STATUS;



