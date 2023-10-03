import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native-onesignal', () => { return { OneSignal: jest.fn(() => 'undefined'), init: jest.fn(() => 'undefined'), inFocusDisplaying: jest.fn(() => 'undefined'), addEventListener: jest.fn(() => 'undefined'), }; });
