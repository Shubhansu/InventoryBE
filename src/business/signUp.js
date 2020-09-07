'use strict'

module.exports = signUp;
const { userService } = require('../services');
const { errorConfig } = require('../config');
const _ = require('lodash');

async function signUp(input) {
    try {
        let userData = await userService.insertUser(input);
        if (_.get(userData, 'status.code') == 1991) {
            return userData;
        }
        return { status: { code: 200 }, data: userData, message: errorConfig.registered };
    } catch (err) {
        throw err;
    }
}