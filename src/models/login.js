'use strict'
const Joi = require("joi");
const errorUtilities = require("../config").errorConfig;

module.exports = login;

function login(input) {
    console.log("Reached Login Validation Model");
    let schema = Joi.object().keys(
        {
            password: Joi.string().min(6).max(16).required().label(errorUtilities.validationError.password),
            username: Joi.string().required().label(errorUtilities.validationError.username)
        }
    );
    return schema.validate(input);
}

