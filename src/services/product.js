
const fs = require('fs');
const _ = require('lodash');
module.exports = {
    getProductById,
    getProducts,
    insertProduct,
    deleteProduct
}

const productPath = `${process.cwd()}/src/resource/product.json`;
async function getProducts(limit) {
    let exisitingJson = fs.readFileSync(productPath, 'utf-8');
    let products = [];
    exisitingJson = JSON.parse(exisitingJson);
    if (exisitingJson.length < limit) {
        limit = exisitingJson.length;
    }
    for (let i = 0; i < limit; i++) {
        products.push(exisitingJson[i]);
    }
    if (products.length > 0) {
        return products;
    } else {
        return { status: { code: 1993, message: 'Product not found' } }
    }
}

async function insertProduct(input) {
    try {
        let exisitingJson = fs.readFileSync(productPath, 'utf-8');
        let productExist = false;
        exisitingJson = JSON.parse(exisitingJson);
        for (let i = 0; i < exisitingJson.length; i++) {
            if (exisitingJson[i].id == input.id) {
                productExist = true;
                break;
            }
        }
        if (productExist) {
            return { status: { code: 1994, message: 'Product already exist' } }
        } else {
            exisitingJson.push(input);
            fs.writeFileSync(productPath, JSON.stringify(exisitingJson));
            return input;
        }

    } catch (err) {
        throw err;
    }
}


async function getProductById(input) {
    try {
        let exisitingJson = fs.readFileSync(productPath, 'utf-8');
        let productExist = false;
        let product;
        exisitingJson = JSON.parse(exisitingJson);
        for (let i = 0; i < exisitingJson.length; i++) {
            if (exisitingJson[i].id == input.id) {
                productExist = true;
                product = exisitingJson[i];
                break;
            }
        }
        if (productExist) {
            return product;
        } else {
            return { status: { code: 1995, message: 'Product not found' } }
        }

    } catch (err) {
        throw err;
    }
}

async function deleteProduct(oldUserName, newUserName) {
    // ToDo
}