

let phoneUtil;
const initPhoneLibrary = () => {
    if (!phoneUtil) phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
}

export const isValidMobile = (mobileNumber, withCountryCode) => {

    initPhoneLibrary();

    try {
        let numberValue = mobileNumber
        if (numberValue.startsWith('00')) {
            numberValue = numberValue.replace('00', '+')
        }

        numberValue = numberValue.replace('00970', '00972')
            .replace('+970', '+972');
        const number = phoneUtil.parse(numberValue, withCountryCode);
        return phoneUtil.isValidNumber(number)
    } catch (e) {
        return false
    }
}



export const separateMobileNumberCountryCode = (numberValue, withInternationalPrefix = false) => {

    initPhoneLibrary();

    const numberObj = phoneUtil.parse(numberValue);

    const localNumber = numberObj.getNationalNumber();
    let countyCode = numberObj.getCountryCode();
    if (withInternationalPrefix)
        countyCode = '+' + countyCode;

    return [countyCode, localNumber];
}

export const getFullNumber = (countryCode, localNumber) => countryCode + removeLeadingZeroes(localNumber);

export const removeLeadingZeroes = (number) => number?.replace(/\b(0(?!\b))+/g, "")
