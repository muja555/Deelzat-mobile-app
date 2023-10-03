import AuthMethodConst from "modules/auth/constants/auth-method.const";

import {isValidEmail} from "deelzat/validation";
import {isValidMobile} from "modules/main/others/phone.utils";
import I19n, {isRTL} from "dz-I19n";

export const isValidAuthEmailOrMobile = (value, geoCode) => {
     return isValidEmail(value) || isValidMobile(value, geoCode);
};


/**
 * Get Error message for sms/email login
 * @param e
 * @returns {string}
 */
export const getErrorMessage = (e) => {
    const authMsg = e?.json?.error_description

    if (authMsg === 'Wrong email or verification code.') {
        if (!isRTL()) {
            return authMsg;
        }
        return 'الرمز المدخل غير صحيح٬ حاول مرة أخرى'
    }
    else if (authMsg === 'The verification code has expired. Please try to login again.') {
        if (!isRTL()) {
            return authMsg;
        }
        return 'لقد انتهت صلاحية هذا الرمز٫ حاول مرة أخرى'
    }
    else if (authMsg === 'You\'ve reached the maximum number of attempts. Please try to login again.') {
        if (!isRTL()) {
            return authMsg;
        }
        return 'لقد استنفذت الحد الأعلى المحاولات٫ حاول مرة أخرى بعد قليل'
    }
    else if (authMsg.includes('Code: 21408')) {
        if (!isRTL()) {
            return authMsg;
        }
        return 'هذا الرقم من منطقة غير مدعومة بعد٫ يرجى المحاولة بطريقة أخرى'
    }

    return I19n.t('نعتذر، خطأ ما قد حصل. يرجى المحاولة مرة أخرى في وقت لاحق');
}


export const getValidMobileNumber = (mobileNumber) => {
    if (!mobileNumber?.startsWith('+') && !mobileNumber?.startsWith('00')) {
        return '+972' + mobileNumber.substring(1) // local PS number
    } else if (mobileNumber?.startsWith('00')){
        return mobileNumber.replace('00', '+')
    }

    return mobileNumber
}
