import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {};
KEYS.FIREBASE_USER_IDENTIFIER = "FIREBASE_USER_IDENTIFIER";
KEYS.FIREBASE_USER_PASSWORD = "FIREBASE_USER_PASSWORD";
KEYS.FIREBASE_USER_TOKEN = "FIREBASE_USER_TOKEN";

const saveFirebaseUserIdentifier = async (userID) => {
    try {
        return AsyncStorage.setItem(KEYS.FIREBASE_USER_IDENTIFIER, userID);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveFirebaseUserIdentifier as saveFirebaseUserIdentifier};


const getFirebaseUserIdentifier = async () => {
    try {
        return await AsyncStorage.getItem(KEYS.FIREBASE_USER_IDENTIFIER);
    } catch (e) {
        console.warn(e);
        return Promise.reject(e);
    }
}
export {getFirebaseUserIdentifier as getFirebaseUserIdentifier};


const saveFirebaseUserPassword = async (userPass ) => {
    try {
        return AsyncStorage.setItem(KEYS.FIREBASE_USER_PASSWORD, userPass);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveFirebaseUserPassword as saveFirebaseUserPassword};


const getFirebaseUserPassword = async () => {
    try {
        return await AsyncStorage.getItem(KEYS.FIREBASE_USER_PASSWORD);
    } catch (e) {
        console.warn(e);
        return Promise.reject(e);
    }
}
export {getFirebaseUserPassword as getFirebaseUserPassword};


const saveFirebaseUserToken = async (idToken ) => {
    try {
        return AsyncStorage.setItem(KEYS.FIREBASE_USER_TOKEN, idToken);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveFirebaseUserToken as saveFirebaseUserToken};


const getFirebaseUserToken = async () => {
    try {
        return await AsyncStorage.getItem(KEYS.FIREBASE_USER_TOKEN);
    } catch (e) {
        console.warn(e);
        return Promise.reject(e);
    }
}
export {getFirebaseUserToken as getFirebaseUserToken};
