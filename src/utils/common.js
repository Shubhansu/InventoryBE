'use strict'

const moment = require("moment");
const _ = require("lodash");
const errorConfig = require('../config/errorConfig');
// const otpServiceName= require('../services').otpService.FORGOT_PASSWORD_EMAIL_REQUEST;

module.exports = {
    loginTypes: ["traditional", "facebook", "google", "mobile", "apple"],
    signUpTypes: ["traditional","mobile"],
    randomString,
    formatValidationErrors,
    isEmail,
    getNestedValue,
    isValidDate,
    responseFormatter,
    getLastLoggedInType,
    dateFormat,
    logVitalHeaders,
    isPasswordUser,
    DbTemplateforVerifyOtpForgetPassword,
    otpMessageFormater,
    formatValidationForPartnerErrors,
    createTempEmail
}

function randomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function formatValidationErrors(errors) {
    let messageString = '';
    const error = {
        invalidCountryCode: 'countryCode must be in correct format e.g. +91',
        invalidEmail: 'Invalid email.',
        leastFavourites: 'Please select at least 5 favourites.',
        invalidProfileName: 'Invalid profile name.',
        invalidDOB: 'Please provide a valid dob.',
    };
    let code;
    let key = _.get(errors, 'details[0]', null);
    if (key.message !== undefined && key.message !== undefined && key.message !== '') {
        const fieldError = `${key.context.key}_${key.type}`;
        console.log(JSON.stringify(key));
        switch (fieldError) {
            case 'countryCode_string.regex.base':
                messageString = error.invalidCountryCode;
                break;
            case 'mobileOrEmail_string.email':
                messageString = error.invalidEmail;
                break;
            case 'characters_array.min':
                messageString = error.leastFavourites;
                break;
            case 'name_string.regex.base':
                messageString = error.invalidProfileName;
                break;
            case 'dob_date.min':
            case 'dob_date.max':
            case 'birthdate_string.regex.base':
            case 'birthdate_date.base':
            case 'birthdate_date.format':
            case 'birthdate_date.max':
                messageString = errorConfig.invalidDOB.description;
                break;
            case 'mobile_string.regex.base':
                messageString = errorConfig.invalidMobile.description;
                break;
            case 'tncVersion_string.regex.base':
                messageString = errorConfig.invalidTncVersion.description;
                break;
            case 'tncAcceptTime_date.max':
                messageString = errorConfig.invalidTncAcceptTime.description;
                break;
            // case 'otp_string.regex.base':
            //     messageString = errorConfig.invalidOtp.description;
            //     break;
            default:
                messageString = (key.message.replace(/\".*\"/m, `${key.context.key}`));
                break;
        }
        code = `${key.context.label}`;
    }
    // remove last comma, quotation marks and whitespaces
    return { message: messageString.charAt(0).toUpperCase() + messageString.slice(1), code: Number(code) };
}

function isEmail(text) {
    const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(String(text).toLowerCase());
}

function getNestedValue(object, pathToProperty) {
    try {
        return eval(`object.${pathToProperty}`);
    } catch (error) {
        return null;
    }
}

function isValidDate(dateString) {
    return moment(dateString).isValid();
}

function responseFormatter(result) {
    let responseCode = (_.get(result, 'status.code') ? _.get(result, 'status.code') : 200);
    if (responseCode == 400 && _.get(result, 'status.message') == errorConfig.requestFailed)
        return {
            httpCode: 500,
            responseData: result
        }
    if (responseCode > 1800)
        responseCode = 400;
    return {
        httpCode: responseCode,
        responseData: result
    }
}

async function getLastLoggedInType(syncedData, lastLoggedInType) {
    if (lastLoggedInType)
        return lastLoggedInType;

    let types = [
        { type: 'facebook', date: _.get(syncedData, 'data.FacebookUser.LastLoginDate') },
        { type: 'google', date: _.get(syncedData, 'data.GmailUser.LastLoginDate') },
        { type: 'traditional', date: _.get(syncedData, 'data.NormalUser.LastLoginDate') }
    ]
    types = await _.orderBy(types, function (o) { return moment(o.date); }, ['desc']);
    return types[types.length - 1].type;
}

function dateFormat(birthdate) {
    if (_.isEmpty(birthdate))
        return birthdate;
    let dd, mm, yyyy;
    if (birthdate.match('/')) {
        let lrDate = birthdate.split('/');
        dd = lrDate[1];
        mm = lrDate[0];
        yyyy = lrDate[2];
    } else {
        let splitDate = birthdate.split('-');
        dd = splitDate[0];
        mm = splitDate[1];
        yyyy = splitDate[2];
    }
    if (dd.length === 1) {
        dd = '0' + dd;
    }
    if (mm.length === 1) {
        mm = '0' + mm;
    }

    if (Number(mm) > 12) {
        let tempdd = dd;
        dd = mm;
        mm = tempdd;
    }
    return dd + '-' + mm + '-' + yyyy;
}

function logVitalHeaders(headers) {
    const requestHeaders = []; // TODO: extract custom header keys to be defined from config
    const keysToKeep = ['appversion', 'devicetype', 'platform', 'user-agent', 'cache-control', 'content-type',
        'x-appengine-city', 'x-appengine-citylatlong', 'x-appengine-country', 'x-appengine-https', 'x-appengine-region', 'x-appengine-user-ip', 'connection',];
    keysToKeep.forEach(key => {
        if (headers[key]) requestHeaders[key] = headers[key];
    });
    console.info({ requestHeaders });
    return requestHeaders;
}

function isPasswordUser(providerData) {
    let isPasswordUser = false;
    if (providerData.length > 0) {
        for (let i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId == 'password') {
                isPasswordUser = true;
                break;
            }
        }
    }
    return isPasswordUser;
}
function DbTemplateforVerifyOtpForgetPassword(data,serviceName,viaMobile,isOtpVerify){
  
    let otpVerified = {
        otp: _.get(data, '_system.' +serviceName + '.otp', '1234'),
        createdAt: _.get(data, '_system.' + serviceName + '.createdAt', moment().format('MMMM Do YYYY, h:mm:ss a')),
        updatedAt: _.get(data, '_system.' + serviceName + '.updatedAt', moment().format('MMMM Do YYYY, h:mm:ss a')),
        attempts: _.get(data, '_system.' + serviceName + '.attempts', 5),
        viaMobile: viaMobile,
        isOtpVerify: isOtpVerify
    }
return otpVerified
}
function otpMessageFormater(Config,textToSend,destinationNumber){
    var params = {
        ApplicationId: Config.AWS1.applicationId,
        MessageRequest: {
          Addresses: {
            [destinationNumber]: {
              ChannelType: 'SMS'
            }
          },
          MessageConfiguration: {
            SMSMessage: {
              Body: textToSend,
              Keyword: 'VKIDS',
              MessageType:  Config.AWS1.PinPoint.attributes.DefaultSMSType,
              SenderId: "VKIDS",
            }
          }
        }
      };
      return params
}

function formatValidationForPartnerErrors(errors) {
    console.log("My Errors", errors);
    let messageString = '';
    const error = {
        invalidMobileNumber: 'Please provide a valid mobile',
        invalidCountryCode: 'countryCode must be in correct format e.g. +91',
        invalidEmail: 'Invalid email.',
        leastFavourites: 'Please select at least 5 favourites.',
        invalidProfileName: 'Invalid profile name.',
        invalidDOB: 'Please provide a valid dob.',
        invalidEndDate: 'endDate should be greater than startDate.',
        invalidStartDate: 'Please provide a valid date e.g. 31-01-2001.',
        invalidData: 'data must be an object',
    };
    let code;
    let key = _.get(errors, 'details[0]', null);
    if (key.message !== undefined && key.message !== undefined && key.message !== '') {
        const fieldError = `${key.context.key}_${key.type}`;
        switch (fieldError) {
            case 'countryCode_string.regex.base':
                messageString = error.invalidCountryCode;
                break;
            case 'mobileOrEmail_string.email':
                messageString = error.invalidEmail;
                break;
            case 'mobile_string.regex.base':
                messageString = error.invalidMobileNumber;
                break;
            case 'characters_array.min':
                messageString = error.leastFavourites;
                break;
            case 'name_string.regex.base':
                messageString = error.invalidProfileName;
                break;
            case 'dob_date.min':
            case 'dob_date.max':
            case 'birthdate_string.regex.base':
            case 'birthdate_date.base':
            case 'birthdate_date.format':
            case 'birthdate_date.max':
                messageString = errorUtilities.invalidDOB.description;
                break;
            case 'tncVersion_string.regex.base':
                messageString = errorUtilities.invalidTncVersion.description;
                break;
            case 'tncAcceptTime_date.max':
                messageString = errorUtilities.invalidTncAcceptTime.description;
                break;
            case 'endDate_date.greater':
                messageString = error.invalidEndDate;
                break;
            case 'endDate_string.regex.base':
                messageString = error.invalidStartDate; //msg same for end date & start date
                break;
            case 'startDate_string.regex.base':
                messageString = error.invalidStartDate;
                break;
            case 'data_object.base':
                messageString = error.invalidData;
                break;
            default:
                messageString = (key.message.replace(/\".*\"/m, `${key.context.key}`));
                break;
        }
        code = `${key.context.label}`;
    }
    // remove last comma, quotation marks and whitespaces
    return { message: messageString, code: Number(code) };
}

function createTempEmail(uid, input) {
    let domainName = _.get(input, 'partnerType');
    const tempEmail = `${uid}@${domainName.toLowerCase()}.com`;
    return tempEmail;

}
