function ResponseBuilder() {}

ResponseBuilder.prototype.success = function(data, msg="Success", code=0) {
    this.code = code
    this.msg = msg
    if (data) {
        this.records = data
    }
}

ResponseBuilder.prototype.error = function(data, msg="Error", code=1) {
    this.code = code
    this.msg = msg
    if (data) {
        this.error = data
    }
}

module.exports = ResponseBuilder