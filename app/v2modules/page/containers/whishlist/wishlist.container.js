import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';

import { savedContainerStyle as style } from './wishlist.container.style';
import {ButtonOptions, Space} from "deelzat/ui";
import {Colors, LayoutStyle, LocalizedLayout, Spacing} from "deelzat/style";
import IconButton from "deelzat/v2-ui/icon-button";
import BackSvg from "assets/icons/BackIcon.svg";
import I19n from "dz-I19n";
import BagIcon from "assets/icons/BagIcon.svg";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import {DzText, Touchable} from "deelzat/v2-ui";
import CornerIcon from "assets/icons/RoundCorner.svg";
import {getTabsOptions, SavedTabConst} from "./wishlist.container.utils";
import SavedTabAllItems from "v2modules/page/components/saved-tab-all-items/saved-tab-all-items.component";
import SavedTabBoards from "v2modules/page/components/saved-tab-boards/saved-tab-boards.component";
import {useDispatch, useSelector} from "react-redux";
import * as wishlistItemsSelectors from "v2modules/board/stores/board.selectors";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {cartSelectors} from "modules/cart/stores/cart/cart.store";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";
import WillShowToast from "deelzat/toast/will-show-toast";
import ImagePreviewModalService from "v2modules/shared/modals/image-preview/image-preview.modal.service";
import WishlistApi from "v2modules/product/apis/wishlist.api";
import GetWishlistItemsInput from "v2modules/product/inputs/wishlist/get-wishlist-items.input";
import {boardThunks} from "v2modules/board/stores/board.store";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

const TAB_BUTTON_HEIGHT = 43;
const WishlistContainer = () => {

    const insets = useSafeAreaInsets();

    const [TabOptions] = useState(getTabsOptions());
    const cartItems = useSelector(cartSelectors.cartItemsSelector);
    const currencyCode = useSelector(geoSelectors.currencyCodeSelector);
    const [tabs] = useState([SavedTabConst.ALL_ITEMS, SavedTabConst.BOARDS]);
    const [currentTab, currentTabSet] = useState(SavedTabConst.ALL_ITEMS);
    const [isLoadingSaved] = useState(false);

    const dispatch = useDispatch();

    const wishlistItems = useSelector(wishlistItemsSelectors.wishlistItemsSelector);
    const wishlist = useSelector(wishlistItemsSelectors.wishlistSelector);

    useEffect(() => {

        if (wishlist) {
            const input = new GetWishlistItemsInput();
            input.wishlistId = wishlist.id;
            WishlistApi.getWishlistItems(input)
                .then(_result => {
                    dispatch(boardThunks.setWishlistItems({
                            newList: _result,
                            oldList: wishlistItems
                        }));
                })
                .catch(console.warn);
        }
    }, [wishlist]);


    const onPressCart = () => {
        RootNavigation.push(MainStackNavsConst.CHECKOUT);
    }

    const onTabButtonPress = (selectedTab) => {
        if (selectedTab !== currentTab) {
            currentTabSet(selectedTab);
        }
    }

    const currentIndex = tabs.findIndex(t => t === currentTab);

    const renderTabButtons = tabs.map((key, index) => {
        const focused = currentTab === key;
        const option = TabOptions[key];
        return (
            <Touchable
                activeOpacity={1}
                onPress={() => onTabButtonPress(tabs[index])}
                key={index}
                style={[style.tabBtn,
                    focused && style.tabBtnFocused,
                    focused && {backgroundColor: option?.backgroundColor},
                    {flex: 1/ tabs.length, height: TAB_BUTTON_HEIGHT}]}>
                <DzText style={[
                    style.tabBtnText,
                    focused && style.tabBtnTextFocused,
                    focused && {color: option?.focusedLabelColor},
                    option?.labelStyle]}>
                    {option?.label}
                </DzText>
                {
                    (!focused && currentIndex - index === 1) &&
                    <View style={style.endBottomCorner}>
                        <CornerIcon width={29}
                                    height={28}
                                    fill={TabOptions[currentTab].backgroundColor}/>
                    </View>
                }
                {
                    (!focused && currentIndex - index === -1) &&
                    <View style={style.startBottomCorner}>
                        <CornerIcon width={29}
                                    height={28}
                                    fill={TabOptions[currentTab].backgroundColor}/>
                    </View>
                }
            </Touchable>
        )
    });



    const onLongPressItem = useCallback((image) => {
        ImagePreviewModalService.setVisible({
            show: true,
            imageUrl: image
        });
    }, []);

    const onPressOutItem = useCallback(() => {
        ImagePreviewModalService.setVisible({
            show: false
        });
    }, []);

    return (
        <View style={[style.container, {paddingTop: insets.top}]}>
            <WillShowToast id={'saved-items'}/>
            <Space directions={'h'} size={'md'} />
            <View style={[LayoutStyle.Row, Spacing.HorizontalPadding, LayoutStyle.AlignItemsCenter]}>
                <IconButton onPress={RootNavigation.goBack} btnStyle={[style.backButton, LocalizedLayout.ScaleX()]} type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BackSvg stroke={Colors.N_BLACK} width={24} height={24}/>
                </IconButton>
                <DzText style={style.title}>
                    {I19n.t('المفضلة')}
                </DzText>
                <IconButton onPress={onPressCart} btnStyle={[style.backButton]} size={ButtonOptions.Size.LG} type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BagIcon width={24} height={24} stroke={Colors.N_BLACK}/>
                    {
                        (cartItems.length > 0) &&
                        <View style={style.countBubble}>
                            <DzText style={style.countBubbleText}>
                                {cartItems.length}
                            </DzText>
                        </View>
                    }
                </IconButton>
            </View>
            <View style={{height: 29}}/>
            <View style={style.tabButtons}>
                {renderTabButtons}
            </View>
            <View style={[style.pageContainer,
                {backgroundColor: TabOptions[currentTab].backgroundColor},
                (currentIndex !== 0) && {borderTopLeftRadius: 24},
                (currentIndex !== tabs.length - 1) && {borderTopRightRadius: 24}]}>
                {
                    (currentTab === SavedTabConst.ALL_ITEMS) &&
                    <SavedTabAllItems wishlistItems={wishlistItems}
                                      isLoadingSaved={isLoadingSaved}
                                      onLongPressItem={onLongPressItem}
                                      onPressOutItem={onPressOutItem}
                                      currencyCode={currencyCode}/>
                }
                {
                    (currentTab === SavedTabConst.BOARDS) &&
                    <SavedTabBoards/>
                }
            </View>
        </View>
    );
};

export default WishlistContainer;
