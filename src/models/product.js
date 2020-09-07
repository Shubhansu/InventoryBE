
'use strict'
const Joi = require("joi");
const errorUtilities = require("../config").errorConfig;

module.exports = {
    getProductsModel,
    getProductByIdModel,
    addProductModel
};

function getProductsModel(input) {
    console.log("Reached getProductsModel Validation Model");
    let schema = Joi.object().keys(
        {
            limit: Joi.number().max(10).required().label(errorUtilities.validationError.limit)
        }
    );
    return schema.validate(input);
}

function getProductByIdModel(input) {
    console.log("Reached getProductByIdModel Validation Model");
    let schema = Joi.object().keys(
        {
            id: Joi.string().required().label(errorUtilities.validationError.productId)
        }
    );
    return schema.validate(input);
}

function addProductModel(input) {
    console.log("Reached addProductModel Validation Model");
    let schema = Joi.object().keys(
        {
            id: Joi.string().required().label(errorUtilities.validationError.productId),
            name: Joi.string().required().label(errorUtilities.validationError.name),
            sku: Joi.string().required().label(errorUtilities.validationError.sku),
            price: Joi.string().required().label(errorUtilities.validationError.price)
        }
    );
    return schema.validate(input);
}

