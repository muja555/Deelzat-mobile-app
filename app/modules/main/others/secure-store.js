import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

const SecureStore = {};

SecureStore.Keys = {};
SecureStore.Keys.USER_CREDENTIALS = 'USER_CREDENTIALS';

SecureStore.get =  async (key, defaultValue = null) => {
    try {
        const value = await RNSecureKeyStore.get(key);
        return Promise.resolve(JSON.parse(value));
    }
    catch (e) {
        return Promise.resolve(JSON.parse(defaultValue));
    }
};

SecureStore.set =  async (key, value) => {
    try {
        await RNSecureKeyStore.set(key,  JSON.stringify(value), { accessible: ACCESSIBLE.ALWAYS });
        return Promise.resolve(true);
    }
    catch (e) {
        console.error(e);
        return Promise.reject(e);
    }
};

export default SecureStore;
