'use strict'

module.exports = login;
const { userService, tokenService } = require('../services');
const _ = require('lodash');
async function login(input) {
    try {
        let userData = await userService.getUserByUserNameAndPassword(input);
        if (_.get(userData, 'status.code') == 1992) {
            return userData;
        }
        let token = tokenService.createAccessToken({
            username: userData['username']
        })
        return { status: { code: 200 }, data: userData, token };

    } catch (err) {
        throw err;
    }
}
