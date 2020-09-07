
'use strict'
const loginBusiness = require('../business').login;
const loginModel = require('../models').login;
const commonUtils = require('../utils').common;
const { apiResponse } = require('../utils');
const errorConfig = require('../config').errorConfig;
const _ = require('lodash');

module.exports = login;

async function login(req, res) {
    try {
        const input = req.body;
        console.log("Login Request Received with input", JSON.stringify(input, null, 2));
        const { error } = loginModel(input);
        if (error) {
            console.log("\n Error in login/validation \n", error);
            return res.status(400).send(apiResponse.error(commonUtils.formatValidationErrors(error)));
        }
        const result = await loginBusiness(input);
        const output = commonUtils.responseFormatter(result);
        return res.status(output.httpCode).send(apiResponse.success(output.responseData));
    } catch (error) {
        console.log("\n Error in login/catch \n", error);
        // handlle kaltur errors
        return res.status(500).send(apiResponse.error(errorConfig.requestFailed));
    }
}