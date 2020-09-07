
'use strict'
const Joi = require("joi");
const errorUtilities = require("../config").errorConfig;

module.exports = signUp;

function signUp(input) {
    console.log("Reached SignUp Validation Model");
    let schema = Joi.object().keys(
        {
            firstName: Joi.string().required().label(errorUtilities.validationError.firstName),
            lastName: Joi.string().required().label(errorUtilities.validationError.lastName),
            password: Joi.string().min(6).max(16).required().label(errorUtilities.validationError.password),
            username: Joi.string().required().label(errorUtilities.validationError.username)
        }
    );
    return schema.validate(input);
}


