import AsyncStorage from '@react-native-async-storage/async-storage';

const PasswordlessAttemptsStoreConst= {};
PasswordlessAttemptsStoreConst.FIRST_ATTEMPT_TIMESTAMP = "FIRST_ATTEMPT_TIMESTAMP";
PasswordlessAttemptsStoreConst.NUMBER_OF_ATTEMPTS = "NUMBER_OF_ATTEMPTS";


const getFirstAttemptTimestamp = async () => {
    try {
        const value = await AsyncStorage.getItem(PasswordlessAttemptsStoreConst.FIRST_ATTEMPT_TIMESTAMP);
        return !!value? parseInt(value): undefined;
    } catch (e) {
    }
}
export {getFirstAttemptTimestamp as getFirstAttemptTimestamp};

const saveFirstAttemptTimestamp = async (timestamp) => {
    try {
        return AsyncStorage.setItem(PasswordlessAttemptsStoreConst.FIRST_ATTEMPT_TIMESTAMP, timestamp + '');
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveFirstAttemptTimestamp as saveFirstAttemptTimestamp};

const getNumberOfAttempts = async () => {
    try {
        const value = await AsyncStorage.getItem(PasswordlessAttemptsStoreConst.NUMBER_OF_ATTEMPTS);
        return !!value? parseInt(value): undefined;
    } catch (e) {
        return 0;
    }
}
export {getNumberOfAttempts as getNumberOfAttempts};

const saveNumberOfAttempts = (attempts) => {
    try {
        return AsyncStorage.setItem(PasswordlessAttemptsStoreConst.NUMBER_OF_ATTEMPTS, attempts + '');
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
}
export {saveNumberOfAttempts as saveNumberOfAttempts};
