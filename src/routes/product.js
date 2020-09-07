
'use strict'
const { getProductsBusiness, getProductByIdBusiness, addProductBusiness } = require('../business');
const { getProductsModel, getProductByIdModel, addProductModel } = require('../models');
const commonUtils = require('../utils').common;
const { apiResponse } = require('../utils');
const errorConfig = require('../config').errorConfig;
const _ = require('lodash');

module.exports = {
    getProducts,
    getProductById,
    addProduct
};

async function getProducts(req, res) {
    try {
        console.log("getProducts Request Received with input");
        const input = {
            limit: _.get(req, 'query.limit')
        };
        const { error } = getProductsModel(input);
        if (error) {
            console.log("\n Error in getProducts/validation \n", error);
            return res.status(400).send(apiResponse.error(commonUtils.formatValidationErrors(error)));
        }
        const result = await getProductsBusiness(input);
        const output = commonUtils.responseFormatter(result);
        return res.status(output.httpCode).send(apiResponse.success(output.responseData));
    } catch (error) {
        console.log("\n Error in getProducts/catch \n", error);
        // handlle kaltur errors
        return res.status(500).send(apiResponse.error(errorConfig.requestFailed));
    }
}

async function getProductById(req, res) {
    try {
        console.log("getProductById Request Received with input");
        const input = {
            id: _.get(req, 'query.id'),
        }
        const { error } = getProductByIdModel(input);
        if (error) {
            console.log("\n Error in getProductById/validation \n", error);
            return res.status(400).send(apiResponse.error(commonUtils.formatValidationErrors(error)));
        }
        const result = await getProductByIdBusiness(input);
        const output = commonUtils.responseFormatter(result);
        return res.status(output.httpCode).send(apiResponse.success(output.responseData));
    } catch (error) {
        console.log("\n Error in getProductById/catch \n", error);
        // handlle kaltur errors
        return res.status(500).send(apiResponse.error(errorConfig.requestFailed));
    }
}

async function addProduct(req, res) {
    try {
        console.log("addProduct Request Received with input");
        const input = _.get(req, 'body');
        const { error } = addProductModel(input);
        if (error) {
            console.log("\n Error in addProduct/validation \n", error);
            return res.status(400).send(apiResponse.error(commonUtils.formatValidationErrors(error)));
        }
        input['addedBy'] = _.get(req, 'tokenInfo.username');
        const result = await addProductBusiness(input);
        const output = commonUtils.responseFormatter(result);
        return res.status(output.httpCode).send(apiResponse.success(output.responseData));
    } catch (error) {
        console.log("\n Error in addProduct/catch \n", error);
        // handlle kaltur errors
        return res.status(500).send(apiResponse.error(errorConfig.requestFailed));
    }
}