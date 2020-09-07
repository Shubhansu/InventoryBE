const { getProducts, getProductById, addProduct } = require('./product');
module.exports = {
    login: require('./login'),
    signUp: require('./signUp'),
    getProducts,
    getProductById,
    addProduct
}