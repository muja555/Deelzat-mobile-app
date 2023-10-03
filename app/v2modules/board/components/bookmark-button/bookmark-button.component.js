import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { wishlistItemsSelector } from 'v2modules/board/stores/board.selectors';
import { boardThunks } from 'v2modules/board/stores/board.store';
import { Colors } from 'deelzat/style';
import { trackSaveProduct } from 'modules/analytics/others/analytics.utils';
import { bookmarkButtonStyle as style } from './bookmark-button.component.style';
import BookmarkShadow from 'assets/icons/BookmarkShadow.png';
import BookmarkWithMarginIcon from 'assets/icons/BookmarkWithSpace.svg';
import BookmarkWithoutMarginIcon from 'assets/icons/Bookmark.svg';

const BookmarkButton = (props) => {
  const {
    product = {},
    isShadowed = false,
    highlightColor = Colors.MAIN_COLOR_70,
    color = 'white',
    width = 32,
    height = 32,
    trackSource,
    FilledIcon,
    ...rest
  } = props;

  const dispatch = useDispatch();
  const wishlistItems = useSelector(wishlistItemsSelector);

  const [isFavourite, isFavouriteSet] = useState(false);

  useEffect(() => {
    const _isFavourite = !!wishlistItems.find((item) => item?.product?.id === product.id);
    isFavouriteSet(_isFavourite);
  }, [wishlistItems]);

  const onPress = () => {
    isFavouriteSet((old) => !old);
    setTimeout(() => {
      if (isFavourite) {
        dispatch(boardThunks.removeFavouriteProduct(product));
      } else {
        trackSaveProduct(product, trackSource);
        dispatch(boardThunks.addFavouriteProduct(product));
      }
    }, 1);
  };

  const Icon = () => {
    const showSpecialIcon = isFavourite && !!FilledIcon;
    const IconComponent = isShadowed ? BookmarkWithMarginIcon : BookmarkWithoutMarginIcon;

    if (showSpecialIcon) {
      return FilledIcon;
    } else {
      return (
        <IconComponent width={width} height={height} fill={isFavourite ? highlightColor : color} />
      );
    }
  };

  return (
    <TouchableOpacity onPress={onPress}
                      hitSlop={{top: 20, bottom: 20, left: 30, right: 30}}
                      activeOpacity={1}
                      {...rest}>
      <View style={{ position: isShadowed ? 'absolute' : 'relative' }}>
        <Icon />
      </View>
      {isShadowed && <Image style={style.shadow} source={BookmarkShadow} />}
    </TouchableOpacity>
  );
};

export default BookmarkButton;
