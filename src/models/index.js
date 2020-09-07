const { getProductsModel, getProductByIdModel, addProductModel } = require('./product');
module.exports = {
    login: require('./login'),
    signUp: require('./signUp'),
    getProductsModel,
    getProductByIdModel,
    addProductModel
}