import { StyleSheet } from 'react-native';
import { Colors } from 'deelzat/style';

const style = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBtn: {
    marginTop: 7,
    width: 36,
    height: 36,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderColor: Colors.alpha(Colors.N_BLACK, 0.2),
  },
  headerBtnText: {
    fontSize: 12,
    textAlign: 'center',
  },
};

const otherProfileContainerStyle = StyleSheet.create(style);
export { otherProfileContainerStyle as notMeProfileContainerStyle };
