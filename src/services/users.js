
const fs = require('fs');
const _ = require('lodash');
module.exports = {
    insertUser,
    updateUser,
    getUserByUserNameAndPassword
}
const userPath = `${process.cwd()}/src/resource/data.json`;
async function getUserByUserNameAndPassword({ username, password }) {
    let exisitingJson = fs.readFileSync(userPath, 'utf-8');
    let userData;
    exisitingJson = JSON.parse(exisitingJson);
    for (let i = 0; i < exisitingJson.length; i++) {
        if (exisitingJson[i].username == username && exisitingJson[i].password == password) {
            userData = exisitingJson[i];
            break;
        }
    }
    if (userData) {
        return userData;
    } else {
        return { status: { code: 1992, message: 'Auth failure' } }
    }
}

async function insertUser(userInput) {
    try {
        let exisitingJson = fs.readFileSync(userPath, 'utf-8');
        let userExist = false;
        exisitingJson = JSON.parse(exisitingJson);
        for (let i = 0; i < exisitingJson.length; i++) {
            if (exisitingJson[i].username == userInput.username) {
                userExist = true;
                break;
            }
        }
        if (userExist) {
            return { status: { code: 1991, message: 'User already exist' } }
        } else {
            exisitingJson.push(userInput);
            fs.writeFileSync(userPath, JSON.stringify(exisitingJson));
            return userInput;
        }

    } catch (err) {
        throw err;
    }
}

async function updateUser(oldUserName, newUserName) {
    // ToDo
}