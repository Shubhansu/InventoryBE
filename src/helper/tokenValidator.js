
const errorConfig = require('../config').errorConfig;
const apiResponse = require('../utils').apiResponse;
const tokenService = require('../services').tokenService;

module.exports = tokenvalidator;
async function tokenvalidator(request, response, next) {
    try {
        console.log("Reached Token Validator");
        const headers = request.headers;
        console.info(JSON.stringify(headers));
        if (!headers.accesstoken) {
            console.error(`tokenvalidator()::Access token not available in header`);
            throw ({ message: errorConfig.invalidRequestHeader });
        }
        const decoded = await tokenService.verifyToken(headers.accesstoken);
        request.tokenInfo = decoded;
        console.info(`tokenvalidator()::Access token verified`);
        next();
    } catch (error) {
        console.error(error.message);
        if (error.message == errorConfig.expiredIdToken.description)
            return response.status(401).send(apiResponse.error(errorConfig.expiredIdToken.description, errorConfig.expiredIdToken.code));
        return response.status(400).send(apiResponse.error(errorConfig.invalidAccessToken.description, errorConfig.invalidAccessToken.code));
    }
};