const { getProductsBusiness, getProductByIdBusiness, addProductBusiness } = require('./product');
module.exports = {
    login: require('./login'),
    signUp: require('./signUp'),
    getProductsBusiness,
    getProductByIdBusiness,
    addProductBusiness
}