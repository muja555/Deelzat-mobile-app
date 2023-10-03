import { StyleSheet } from 'react-native';
import { Colors, Font } from 'deelzat/style';

const style = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerBackground: {
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  headerContents: {
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  },
  navigator: {
    flex: 1,
    backgroundColor: Colors.N_GREY_4,
  },
  headerBtn: {
    height: 28,
    width: 107,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  headerBtnText: {
    fontSize: 12,
    textAlign: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderWidth: 0
  },
  headerBtnIconsContainer: {
    flexDirection: 'row',
    paddingStart: 15,
    paddingEnd: 15,
  },
  infoHeader: {
    flexDirection: 'row',
    paddingStart: 15,
    paddingEnd: 15,
  },
  imageView: {
    width: 80,
    height: 80,
  },
  profileImage: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 70,
    height: 70,
    zIndex: 10,
    overflow: 'hidden',
    borderRadius: 12,
  },
  frame: {
    width: '100%',
    height: '100%',
  },
  statusView: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 10,
  },
  numberValue: {
    color: Colors.MAIN_COLOR,
    fontSize: 14,
    ...Font.Bold,
  },
  numberLabel: {
    color: Colors.N_BLACK_50,
    fontSize: 12,
    marginTop: -6,
  },
  numbersView: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  firstLastName: {
    color: Colors.N_BLACK,
    fontSize: 14,
    paddingHorizontal: 15,
    ...Font.Bold,
  },
  storeView: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  store: {
    color: Colors.MAIN_COLOR,
    fontSize: 16,
    ...Font.Bold,
  },
  storeName: {
    color: Colors.N_BLACK,
    fontSize: 16,
    flexWrap: 'wrap',
    ...Font.Bold,
  },
  aboutText: {
    fontSize: 14,
    color: Colors.N_BLACK,
    paddingHorizontal: 15,
  },
  locationIcon: {
    width: 24,
    height: 24,
  },
  infoGrey: {
    color: Colors.alpha(Colors.N_BLACK, 0.6),
    fontSize: 12,
  },
  shareBtn: {
    marginEnd: 14,
  },
  shopNameGradient: {
    height: 30,
    width: '150%',
  }
};

const profileStyle = StyleSheet.create(style);
export { profileStyle as profileStyle };
