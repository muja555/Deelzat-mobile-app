import AsyncStorage from '@react-native-async-storage/async-storage';

const BLOCKED_SHOPS_LIST = "BLOCKED_SHOPS_LIST";

const saveBlockedShops = async (blockedList = []) => {
    try {
        const value = JSON.stringify(blockedList);
        return AsyncStorage.setItem(BLOCKED_SHOPS_LIST, value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveBlockedShops as saveBlockedShops};


const getBlockedShops = async () => {
    try {
        const value = await AsyncStorage.getItem(BLOCKED_SHOPS_LIST);
        return JSON.parse(value);
    } catch (e) {
        console.warn(e);
        return [];
    }
}
export {getBlockedShops as getBlockedShops};

