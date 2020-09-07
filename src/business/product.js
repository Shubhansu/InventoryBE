
'use strict'
const {productService} = require('../services')
const _ = require('lodash');
module.exports = {
    getProductsBusiness,
    getProductByIdBusiness,
    addProductBusiness
};

async function getProductsBusiness(input) {
    let products = await productService.getProducts(input['limit']);
    if (_.get(products, 'status.code') == 1993) {
        return products;
    }
    return { data: products, status: { code: 200}};
}

async function getProductByIdBusiness(input) {
    let products = await productService.getProductById(input);
    if (_.get(products, 'status.code') == 1995) {
        return products;
    }
    return { data: products, status: { code: 200}};
}

async function addProductBusiness(input) {
    let products = await productService.insertProduct(input);
    if (_.get(products, 'status.code') == 1994) {
        return products;
    }
    return { data: products, status: { code: 200}};
}
