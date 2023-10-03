import BagIcon from 'assets/icons/BagIcon.svg';
import BookmarkGreenBlack from 'assets/icons/BookmarkGreenBlack.svg';
import EditPricesIcon from 'assets/icons/EditPrices.svg';
import { Colors, LayoutStyle } from 'deelzat/style';
import { Space } from 'deelzat/ui';
import { DzText, Touchable } from 'deelzat/v2-ui';
import ImageWithBlur from 'deelzat/v2-ui/image-with-blur';
import I19n from 'dz-I19n';
import get from 'lodash/get';
import { trackClickOnProductListItemAction } from 'modules/analytics/others/analytics.utils';
import { refactorImageUrl } from 'modules/main/others/main-utils';
import ProductApi from 'modules/product/apis/product.api';
import ProductDetailsGetInput from 'modules/product/inputs/product-details-get.input';
import { isDiscountProduct, isSoldOutProduct } from 'modules/product/others/product-listing.utils';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import BookmarkButton from 'v2modules/board/components/bookmark-button/bookmark-button.component';
import ProductListItemActions from './product-list-item-action.const';
import { productListItemStyle as style } from './product-list-item.component.style';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ProductListItem = (props) => {
    const {
        product = null,
        currencyCode = '',
        allowEdit = false,
        btnColor = Colors.MAIN_COLOR,
        onPress = () => {},
        onLongPress = () => {},
        onPressOut = () => {},
        onActionPress = (item, actionType, extraData) => {},
        bookmarkTrackSource,
        displayMinimalLook = true,
    } = props;

  const [isBtnLoading, isBtnLoadingSet] = useState(false);
  const [isSmallBtnLoading, isSmallBtnLoadingSet] = useState(false);
  const [isCheckoutBtnLoading, isCheckoutBtnLoadingSet] = useState(false);

  const onEditPress = () => {
    onActionPress(product, ProductListItemActions.EDIT);
    trackClickOnProductListItemAction(product, ProductListItemActions.EDIT);
  };

  const requestDetails = () => {
    const inputs = new ProductDetailsGetInput();
    inputs.productID = product.id + '';
    return ProductApi.getProductDetails(inputs, true);
  };

  const onEditPricesPress = () => {
    trackClickOnProductListItemAction(product, ProductListItemActions.EDIT_PRICES);
    isSmallBtnLoadingSet(true);

    requestDetails()
      .then((fullProduct) => {
        onActionPress(fullProduct, ProductListItemActions.EDIT_PRICES);
      })
      .catch((e) => {
        onActionPress(
          {
            ...product,
            isNotFound: true,
          },
          ProductListItemActions.EDIT_PRICES
        );
      })
      .then(isSmallBtnLoadingSet);
  };

  const onBuyPress = () => {

    if (displayMinimalLook) {
        trackClickOnProductListItemAction(product, ProductListItemActions.INFO);
        onPress();
    }
    else {
        trackClickOnProductListItemAction(product, ProductListItemActions.BUY);
        isCheckoutBtnLoadingSet(true);
        requestDetails()
            .then((fullProduct) => {
                onActionPress(fullProduct, ProductListItemActions.BUY);
            })
            .catch((e) => {
                onActionPress(
                    {
                        ...product,
                        isNotFound: true,
                    },
                    ProductListItemActions.BUY
                );
            })
            .then(isCheckoutBtnLoadingSet);
    }
  };

  const onBagPress = () => {
    trackClickOnProductListItemAction(product, ProductListItemActions.ADD_TO_BAG);
    isSmallBtnLoadingSet(true);

    requestDetails()
      .then((fullProduct) => {
        onActionPress(fullProduct, ProductListItemActions.ADD_TO_BAG);
      })
      .catch((e) => {
        onActionPress(
          {
            ...product,
            isNotFound: true,
          },
          ProductListItemActions.ADD_TO_BAG
        );
      })
      .then(isSmallBtnLoadingSet);
  };

  const onPressContactSeller = () => {
    trackClickOnProductListItemAction(product, ProductListItemActions.CONTACT_SELLER);
    isBtnLoadingSet(true);

    requestDetails()
      .then((_res) => {
        const shopAuthId = _res.shop?.shop_auth_id?.length && _res.shop.shop_auth_id[0];
        onActionPress(_res, ProductListItemActions.CONTACT_SELLER, shopAuthId);
        isBtnLoadingSet(false);
      })
      .catch((e) => {
        console.warn(e);
        isBtnLoadingSet(false);
      });
  };

  const isDiscount = isDiscountProduct(product);
  const isSoldOut = isSoldOutProduct(product);

  const isSoldable = (product) => {
    const isFoodProduct = get(product, 'tags', []).some((tag) => tag.includes('طعام'));
    const isNewProduct = get(product, 'meta.global.condition', 'جديد') === 'جديد';
    return !isFoodProduct && isNewProduct;
  };

  const isDeliveryAvailable = isSoldable(product);

  const mainPrice = parseFloat(product.price) + ' ' + currencyCode;
  const compareAtPrice = parseFloat(product.compare_at_price) + ' ' + currencyCode;

  const renderMidContent = displayMinimalLook ? (
    <>
      <View style={style.imageContainer}>
        <View style={style.imageGradientCont}>
          <ImageWithBlur
            style={style.imageMin}
            resizeMode="cover"
            resizeMethod="resize"
            attatchToObj={product}
            thumbnailUrl={refactorImageUrl(product?.image, 1)}
            imageUrl={refactorImageUrl(product?.image, SCREEN_WIDTH / 2)}
          />
        </View>
        {isDiscount && (
          <View style={style.saleView}>
            <DzText style={style.saleText}>{I19n.t('خصم')}</DzText>
          </View>
        )}
        {isSoldOut && (
          <View style={[style.saleView, style.soldOut]}>
            <DzText style={style.saleText}>{I19n.t('نفذت الكمية')}</DzText>
          </View>
        )}
      </View>
      <View style={{ height: 4 }} />
      <View style={style.pricesBoardView}>
        <View style={style.pricesView}>
          <DzText style={[style.mainPrice, isDiscount && style.discountPriceMin]}>
            {mainPrice}
          </DzText>
          {isDiscount && <DzText style={style.oldPriceMin}>{compareAtPrice}</DzText>}
        </View>
        <BookmarkButton
          product={product}
          width={18}
          height={18}
          color={Colors.N_BLACK_50}
          FilledIcon={<BookmarkGreenBlack width={18} height={18} />}
          trackSource={bookmarkTrackSource}
        />
      </View>
      <DzText style={style.titleMin} numberOfLines={1}>
        {product.title}
      </DzText>
      <Space directions={'h'} size={'sm'} />
    </>
  ) : (
    <>
      <ImageWithBlur
        style={style.image}
        resizeMode="cover"
        resizeMethod="resize"
        attatchToObj={product}
        thumbnailUrl={refactorImageUrl(product?.image, 1)}
        imageUrl={refactorImageUrl(product?.image, SCREEN_WIDTH / 2)}
      />
      {isDiscount && (
        <View style={style.saleView}>
          <DzText style={style.saleText}>{I19n.t('خصم')}</DzText>
        </View>
      )}
      {isSoldOut && (
        <View style={[style.saleView, style.soldOut]}>
          <DzText style={style.saleText}>{I19n.t('نفذت الكمية')}</DzText>
        </View>
      )}
      <Space directions={'h'} size={'sm'} />
      <View style={style.pricesBoardView}>
        <View>
          {isDiscount && <DzText style={style.oldPrice}>{compareAtPrice}</DzText>}
          <DzText style={[style.mainPrice, isDiscount && style.discountPrice]}>{mainPrice}</DzText>
        </View>
        <BookmarkButton
          product={product}
          width={24}
          height={24}
          color={Colors.N_BLACK_50}
          FilledIcon={<BookmarkGreenBlack />}
          trackSource={bookmarkTrackSource}
        />
      </View>
      <DzText style={style.title} numberOfLines={1}>
        {product.title}
      </DzText>
      <Space directions={'h'} />
    </>
  );

  return (
    <Touchable
      activeOpacity={1}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressOut={onPressOut}
      style={style.container}>
      {renderMidContent}
      <View style={style.buttonsView}>
        {allowEdit && (
          <>
            <Touchable onPress={onEditPress} style={[style.buyBtn, {backgroundColor: btnColor}]}>
              <DzText style={style.buyText}>{I19n.t('تعديل')}</DzText>
            </Touchable>
            {displayMinimalLook ? <View style={{ width: 5 }} /> : <Space directions={'v'} />}
            <Touchable onPress={onEditPricesPress} style={[style.smallBtn, {backgroundColor: btnColor}]}>
              {isSmallBtnLoading && (
                <ActivityIndicator
                  style={[style.activityIndicator, { marginEnd: 0 }]}
                  size={16}
                  color={'#fff'}
                />
              )}
              {!isSmallBtnLoading && (
                <EditPricesIcon width={20} height={20} strokeWidth={0.1} stroke={'#fff'} />
              )}
            </Touchable>
          </>
        )}
        {!allowEdit && isDeliveryAvailable && (
          <>
            <Touchable
              onPress={onBuyPress}
              disabled={isSoldOut || isCheckoutBtnLoading}
              style={[
                style.buyBtn,
                {backgroundColor: btnColor},
                displayMinimalLook && style.buyBtnMin,
                (isSoldOut || isCheckoutBtnLoading) && style.btnDisabled,
              ]}
            >
              {isCheckoutBtnLoading && (
                <ActivityIndicator style={style.checkoutLoading} size={16} color={'#fff'} />
              )}
              <DzText style={[style.buyText, isCheckoutBtnLoading && { opacity: 0 }]}>
                {displayMinimalLook ? I19n.t('تفاصيل') : I19n.t('اشتري الآن')}
              </DzText>
            </Touchable>
            {displayMinimalLook ? <View style={{ width: 5 }} /> : <Space directions={'v'} />}
            <Touchable
              onPress={onBagPress}
              disabled={isSoldOut || isSmallBtnLoading}
              style={[style.smallBtn, {backgroundColor: btnColor}, (isSoldOut || isSmallBtnLoading) && style.btnDisabled]}
            >
              {isSmallBtnLoading && (
                <ActivityIndicator
                  style={[style.activityIndicator, { marginEnd: 0 }]}
                  size={16}
                  color={'#fff'}
                />
              )}
              {!isSmallBtnLoading && <BagIcon width={20} height={20} stroke={'#fff'} />}
            </Touchable>
          </>
        )}
        {!allowEdit && !isDeliveryAvailable && (
          <Touchable
            onPress={onPressContactSeller}
            disabled={isBtnLoading}
            style={[style.buyBtn, {backgroundColor: btnColor}, LayoutStyle.Flex]}
          >
            {isBtnLoading && (
              <ActivityIndicator style={style.activityIndicator} size={16} color={'#fff'} />
            )}
            <DzText style={style.buyText}>{I19n.t('تواصل مع البائع')}</DzText>
          </Touchable>
        )}
      </View>
    </Touchable>
  );
};

export default ProductListItem;
