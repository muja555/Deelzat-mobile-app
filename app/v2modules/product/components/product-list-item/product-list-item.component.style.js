import { StyleSheet } from 'react-native';
import { Colors, Font } from 'deelzat/style';

const style = {
  container: {
    flexGrow: 1,
  },
  imageContainer: {
    borderRadius: 12,
    shadowRadius: 4,
    elevation: 6,
    shadowColor: '#393939',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
  },
  image: {
    height: 166,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.alpha('#000', 0.2),
  },
  imageMin: {
    aspectRatio: 1,
    width: '100%',
  },
  imageGradientCont: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Colors.alpha('#000', 0.1),
  },
  pricesBoardView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  pricesView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainPrice: {
    color: Colors.N_BLACK,
    fontSize: 14,
    ...Font.Bold,
  },
  mainPriceMin: {
    position: 'absolute',
    bottom: 1,
    right: 5,
    fontSize: 14,
    color: 'white',
    zIndex: 5,
    letterSpacing: -0.3,
    ...Font.Bold,
  },
  discountPrice: {
    color: Colors.BLACK_RED,
  },
  discountPriceMin: {
    color: Colors.LIGHT_ORANGE,
    marginEnd: 3,
  },
  oldPrice: {
    color: Colors.N_BLACK,
    fontSize: 11,
    textDecorationLine: 'line-through',
    marginBottom: -4,
    fontWeight: '400',
  },
  oldPriceMin: {
    color: Colors.N_BLACK,
    fontSize: 10,
    marginTop: -1,
    textDecorationLine: 'line-through',
  },
  title: {
    color: Colors.N_BLACK_50,
    fontSize: 12,
    flex: 1,
    textAlign: 'left',
    ...Font.Bold,
  },
  titleMin: {
    color: Colors.N_BLACK_50,
    fontSize: 12,
    flex: 1,
    textAlign: 'left',
    lineHeight: 16,
  },
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyBtn: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 8,
    flexDirection: 'row',
  },
  buyBtnMin: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 1,
    flexDirection: 'row',
  },
  smallBtn: {
    height: 36,
    width: 36,
    backgroundColor: Colors.MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buyText: {
    color: '#fff',
    fontSize: 12,
  },
  saleView: {
    position: 'absolute',
    right: 0,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    minWidth: 51,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.alpha(Colors.LIGHT_ORANGE, 1),
  },
  soldOut: {
    backgroundColor: Colors.alpha('#E40102', 0.75),
    minWidth: 70,
  },
  saleText: {
    fontSize: 10,
    color: '#fff',
    ...Font.Bold,
  },
  activityIndicator: {
    width: 16,
    height: 16,
    marginEnd: 10,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  checkoutLoading: {
    position: 'absolute',
    zIndex: 10,
    width: 16,
    height: 16,
  },
  gradient: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.75,
    left: 0,
    right: 0,
    top: 0,
    overflow: 'hidden',
    zIndex: 5,
    resizeMode: 'stretch',
  },
  bookmarkBtnMin: {
    position: 'absolute',
    zIndex: 10,
    bottom: 5,
    left: 5,
  },
};

const productListItemStyle = StyleSheet.create(style);
export { productListItemStyle as productListItemStyle };
