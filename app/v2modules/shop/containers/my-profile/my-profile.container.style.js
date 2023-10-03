import { StyleSheet } from 'react-native';

const style = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentScroll: {
    flexGrow: 1,
  },
  topBtn: {
    width: 24,
    height: 24,
  },
  loggedOutProfile: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1000,
  },
  headerBtnText: {
    fontSize: 12,
    textAlign: 'center',
  },
};

const myProfileContainerStyle = StyleSheet.create(style);
export { myProfileContainerStyle as profileContainerStyle };
