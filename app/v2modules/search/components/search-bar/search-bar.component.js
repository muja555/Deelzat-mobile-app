import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { searchBarStyle as style } from './search-bar.component.style';
import IconButton from "deelzat/v2-ui/icon-button";
import SearchIcon from 'assets/icons/NewSearch.svg';
import ChatIcon from 'assets/icons/Chat2.svg';
import BookmarkIcon from 'assets/icons/Bookmark.svg';
import BagIcon from 'assets/icons/BagIcon.svg';
import {ButtonOptions, Space} from "deelzat/ui";
import {Colors} from "deelzat/style";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import {authSelectors} from "modules/auth/stores/auth/auth.store";
import {useSelector} from "react-redux";
import AuthRequiredModalService from "modules/auth/modals/auth-required/auth-required.modal.service";
import SIGNUP_SOURCE from "modules/analytics/constants/analytics-signup-source.const";
import I19n from "dz-I19n";
import {chatSelectors} from "modules/chat/stores/chat/chat.store";
import {cartSelectors} from "modules/cart/stores/cart/cart.store";
import {DzText} from "deelzat/v2-ui";

const SearchBar = (props) => {
    const {
        btnStyle = {},
        iconColor = Colors.alpha(Colors.N_BLACK, 0.5),
    } = props;

    const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);
    const unreadMessages = useSelector(chatSelectors.unreadMessagesSelector);
    const cartItems = useSelector(cartSelectors.cartItemsSelector);

    const onPressSearch = () => {
        RootNavigation.push(MainStackNavsConst.SEARCH)
    }

    const onPressCart = () => {
        RootNavigation.push(MainStackNavsConst.CHECKOUT);
    }

    const onInboxPress = () => {

        if (!isAuthenticated) {
            AuthRequiredModalService.setVisible({
                message: I19n.t('أنشئ حساب لتتمكن من التواصل مع الأخرين'),
                trackSource: {
                    name: SIGNUP_SOURCE.OPEN_INBOX,
                },
                onAuthSuccess: () =>  RootNavigation.push(MainStackNavsConst.INBOX)
            })
        } else {
            RootNavigation.push(MainStackNavsConst.INBOX)
        }
    }


    const onPressSaved = () => {
        RootNavigation.push(MainStackNavsConst.SAVED_PRODUCTS);
    }


    const getUnreadCount = () => {

        let count = 0;
        const _map = unreadMessages || {};
        Object.keys(_map).forEach(userId => {
            count = count + (_map[userId] || 0);
        });

        return count;
    }


    return (
        <View style={style.container}>
            <IconButton btnStyle={{...style.btnStyle, ...btnStyle}}
                        size={ButtonOptions.Size.LG}
                        type={ButtonOptions.Type.MUTED_OUTLINE}
                        onPress={onPressSearch}>
                <SearchIcon width={22} height={22} fill={iconColor}/>
            </IconButton>
            <View style={style.actionsView}>
                <IconButton onPress={onInboxPress} btnStyle={{...style.btnStyle, ...btnStyle}} size={ButtonOptions.Size.LG} type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <ChatIcon width={20} height={20} stroke={iconColor}/>
                    {
                        (getUnreadCount() > 0) &&
                        <View style={style.countBubble}>
                            <DzText style={style.countBubbleText}>
                                {getUnreadCount()}
                            </DzText>
                        </View>
                    }
                </IconButton>
                <Space directions={'v'} size={'md'}/>
                <IconButton onPress={onPressSaved} btnStyle={{...style.btnStyle, ...btnStyle}} size={ButtonOptions.Size.LG} type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BookmarkIcon width={22} height={22} fill={iconColor}/>
                </IconButton>
                <Space directions={'v'} size={'md'}/>
                <IconButton onPress={onPressCart} btnStyle={{...style.btnStyle, ...btnStyle}} size={ButtonOptions.Size.LG} type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BagIcon width={24} height={24} stroke={iconColor}/>
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
        </View>
    );
};

export default SearchBar;
