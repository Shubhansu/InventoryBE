'use strict'
module.exports = {
    success,
    error
}
function success(message = null, data = null, code = 200) {
    let outputData = data;
    const status = {
        code: code,
        message: message
    };
    if (!message) status.message = 'OK';
    if (typeof message === 'object') {
        status.message = 'OK';
        outputData = message;
    }
    console.info("Final Response", outputData);
    return { ...outputData };
}

function error(message = null, code = 400) {
    const status = {
        code: code,
        message: message
    };
    if (message.code)
        status.code = message.code; //TODO: remove it later, upon better implementation (need to send error code along with message)
    if (message.message)
        status.message = message.message; //TODO: remove it later, upon better implementation (need to send error code along with message)
    if (!message)
        status.message = 'ERROR';
    return {
        status
    };
}