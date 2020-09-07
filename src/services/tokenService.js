
'use strict'

const jwt = require("jsonwebtoken");
const _ = require('lodash');
const {config, errorConfig} = require('../config');

module.exports = {
    verifyToken,
    createAccessToken,
}
function verifyToken(token) {
    try {
        console.log(`TokenService.verifyToken() is called with token ${token}`);
        const decoded = jwt.verify(token, config.jwt.secret);
        console.log(`decoded ${JSON.stringify(decoded)}`);
        return decoded;
    } catch (error) {
        console.log(`TokenService.verifyToken() error in verifying token ${error}`);
        if (error.name === undefined || error.message === undefined) throw (new Error(errorConfig.requestFailed));
        switch (error.message) {
            case 'jwt expired':
                throw (new Error(errorConfig.expiredProfileToken));
            case 'jwt invalid':
            case 'jwt malformed':
            case 'jwt not active':
            case 'jwt signature is required':
            case 'invalid signature':
            case 'auth/user-not-found':
                throw (new Error(errorConfig.invalidAccessToken.description));
            case 'invalid token':
                throw (new Error(errorConfig.invalidAccessToken.description));
            default:
                throw (new Error(errorConfig.requestFailed));
        }
    }
}

function createAccessToken(payload) {
    try {
        console.log(`TokenService.createAccessTokenAndRefreshToken() with payload: ${JSON.stringify(payload)}`);
        const access_token = jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn, issuer: config.jwt.issuer });
        const accessTokenDecoded = jwt.decode(access_token);
        return ({
            accessToken: access_token,
            expirationTime: accessTokenDecoded['exp']
        });
    } catch (error) {
        console.log(`TokenService.createAccessTokenAndRefreshToken() error in creating tokens ${error}`);
        throw (new Error(errorConfig.requestFailed));
    }
}