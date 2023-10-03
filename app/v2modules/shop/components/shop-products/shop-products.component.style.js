import { StyleSheet } from 'react-native';
import { Colors, Font, Spacing } from 'deelzat/style';

const HEADER_HEIGHT = 60;
const style = {
  container: {
    flex: 1,
  },
  loadingView: {
    flex: 1,
  },
  footerLoader: {
    height: 70,
  },
  contentContainerStyle: {
    paddingStart: 14,
    paddingEnd: 14,
  },
  editProductBtn: {
    height: 45,
    backgroundColor: Colors.MAIN_COLOR,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteProductBtn: {
    height: 45,
    backgroundColor: Colors.BLACK_RED,
    borderColor: Colors.BLACK_RED,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visibleTab: {
    height: 'auto',
    flex: 1,
    opacity: 1,
  },
  hiddenTab: {
    height: 0,
    flex: 0,
    opacity: 0,
  },
  listHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.N_GREY_4,
    width: '100%',
    height: HEADER_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 3,
  },
  filterBtn: {
    marginStart: 14,
    marginEnd: 10,
    width: 36,
    height: 36,
    backgroundColor: Colors.MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  cateogryLabel: {
    color: Colors.N_BLACK,
    fontSize: 14,
    marginEnd: 5,
    marginStart: 10,
    ...Font.Bold,
  },
  categoriesList: {
    justifyContent: 'flex-start',
    flexGrow: 1,
    flexDirection: 'row',
    paddingEnd: 20,
  },
  previewImage: {
    width: '80%',
    height: '60%',
    borderRadius: 12,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyViewText: {
    textAlign: 'center',
    color: Colors.N_BLACK,
    fontSize: 16,
  },
  emptyViewBtn: {
    width: '80%',
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyViewBtnText: {
    fontSize: 14,
    color: 'white',
  },
};

const shopProductsStyle = StyleSheet.create(style);
export { shopProductsStyle as shopProductsStyle };
