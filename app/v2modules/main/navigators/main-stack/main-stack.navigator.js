import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {screenListener} from "modules/analytics/others/analytics.utils";
import MainTabsContainer from "v2modules/main/containers/main-tabs/main-tabs.container";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import OnBoardingContainer from "v2modules/page/containers/onboarding/onboarding.container";
import SearchContainer from "v2modules/page/containers/search/search.container";
import CategoriesContainer from "v2modules/page/containers/categories/categories.container";
import ProductListContainer from "v2modules/product/containers/product-list/product-list.container";
import ProductFiltersContainer from "v2modules/product/containers/product-filters/product-filters.container";
import ProductDetailsContainer from "v2modules/product/containers/product-details/product-details.container";
import OtherProfileContainer from "v2modules/shop/containers/other-profile/other-profile.container";
import ProductAddContainer from "modules/product/containers/product-add/product-add.container";
import DeveloperSettingsContainer from "modules/developer-settings/containers/developer-settings.container";
import ProductUpdateContainer from "modules/product/containers/product-update/product-update.container";
import ImageGalleryContainer from "v2modules/page/containers/image-gallery/image-gallery.container";
import EditProfileContainer from "v2modules/shop/containers/edit-profile/edit-profile.container";
import ChatRoomContainer from "modules/chat/containers/chat-room/chat-room.container";
import InboxContainer from "modules/chat/containers/inbox/inbox.container";
import WishlistContainer from "v2modules/page/containers/whishlist/wishlist.container";
import SalesContainer from "v2modules/page/containers/sales/sales.container";
import SettingsContainer from "v2modules/page/containers/settings/settings.container";
import InfoContainer from "v2modules/page/containers/info/info.container";
import ChatImagesPickerContainer
    from "modules/chat/containers/chat-images-picker/chat-images-picker.container";
import OrdersContainer from "v2modules/page/containers/orders/orders.container";
import OrderDetailsContainer from "v2modules/page/containers/order-details/order-details.container";
import FollowersListContainer from "v2modules/page/containers/followers-list/followers-list.container";
import SavedAddressesContainer from 'v2modules/checkout/containers/saved-addresses/saved-addresses.container';
import AddAddressContainer from 'v2modules/checkout/containers/add-address/add-address.container';
import CheckoutContainer from 'v2modules/checkout/containers/checkout/checkout.container';
import BlockedShopsContainer from 'v2modules/page/containers/blocked-shops/blocked-shops.container';
import CouponsListContainer from 'v2modules/page/containers/coupons-list/coupons-list.container';

const Stack = createStackNavigator();

function MainStackNavigator() {
    return (
        <Stack.Navigator
            animationEnabled={true}
            useNativeDriver={true}
            screenOptions={{animationEnabled: true, useNativeDriver: true, swipeEnabled: true}}
        >

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.HOME_TABS}
                component={MainTabsContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.ON_BOARDING}
                listeners={screenListener}
                component={OnBoardingContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.SEARCH}
                listeners={screenListener}
                component={SearchContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.CATEGORIES}
                listeners={screenListener}
                component={CategoriesContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.PRODUCT_LIST}
                listeners={screenListener}
                component={ProductListContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.PRODUCT_FILTERS}
                listeners={screenListener}
                component={ProductFiltersContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.PRODUCT_DETAILS}
                listeners={screenListener}
                component={ProductDetailsContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.OTHER_PROFILE}
                listeners={screenListener}
                component={OtherProfileContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.IMAGE_GALLERY}
                listeners={screenListener}
                component={ImageGalleryContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.ADD_PRODUCT}
                listeners={screenListener}
                component={ProductAddContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.SECRET_SETTINGS}
                listeners={screenListener}
                component={DeveloperSettingsContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.PRODUCT_UPDATE}
                listeners={screenListener}
                component={ProductUpdateContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.EDIT_PROFILE}
                listeners={screenListener}
                component={EditProfileContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.INBOX}
                listeners={screenListener}
                component={InboxContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.CHAT_ROOM}
                listeners={screenListener}
                component={ChatRoomContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.SAVED_PRODUCTS}
                listeners={screenListener}
                component={WishlistContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.SALES}
                listeners={screenListener}
                component={SalesContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.ORDERS}
                listeners={screenListener}
                component={OrdersContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.ORDER_DETAILS}
                listeners={screenListener}
                component={OrderDetailsContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.SETTINGS}
                listeners={screenListener}
                component={SettingsContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.INFO}
                listeners={screenListener}
                component={InfoContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.CHAT_IMAGES_PICKER}
                listeners={screenListener}
                component={ChatImagesPickerContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.FOLLOWERS_LIST}
                listeners={screenListener}
                component={FollowersListContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.SAVED_ADDRESSES}
                listeners={screenListener}
                component={SavedAddressesContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.ADD_ADDRESS}
                listeners={screenListener}
                component={AddAddressContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.CHECKOUT}
                listeners={screenListener}
                component={CheckoutContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.BLOCKED_USERS}
                listeners={screenListener}
                component={BlockedShopsContainer}/>

            <Stack.Screen
                options={{headerShown: false}}
                name={MainStackNavsConst.COUPONS_LIST}
                listeners={screenListener}
                component={CouponsListContainer}/>

        </Stack.Navigator>
    );
}

export default MainStackNavigator;
