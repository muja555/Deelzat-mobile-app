import React, {useState} from 'react';
import {View, Text, SafeAreaView, ScrollView, Platform} from 'react-native';

import { settingsContainerStyle as style } from './settings.container.style';
import {ButtonOptions, Space} from "deelzat/ui";
import {Colors, LayoutStyle, LocalizedLayout} from "deelzat/style";
import IconButton from "deelzat/v2-ui/icon-button";
import BackSvg from "assets/icons/BackIcon.svg";
import I19n from "dz-I19n";
import {CommonActions, useNavigation} from "@react-navigation/native";

import {DzText, Touchable} from "deelzat/v2-ui";

import {useDispatch, useSelector} from "react-redux";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import {authSelectors, authThunks} from "modules/auth/stores/auth/auth.store";
import GlobalSpinnerService from "modules/main/components/global-spinner/global-spinner.service";

import {saveChatUnreadMessages} from "modules/chat/others/chat.localstore";
import {chatActions} from "modules/chat/stores/chat/chat.store";
import Settings from "v2modules/page/components/settings/settings.component";
import {trackLogout} from "modules/analytics/others/analytics.utils";
import WillShowToast from "deelzat/toast/will-show-toast";
import { remoteConfig } from 'modules/root/components/remote-configs/remote-configs.component';
import RemoteConfigsConst from 'modules/root/constants/remote-configs.const';

const SettingsContainer = () => {

    const navigation = useNavigation();
    const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);
    const dispatch = useDispatch();

    const [showDeleteAccount] = useState(remoteConfig.getBoolean(RemoteConfigsConst.SHOW_DELETE_ACCOUNT));

    const onPressLogout = () => {
        GlobalSpinnerService.setVisible(true);

        clearUnreadMessages();
        trackLogout();

        setTimeout(() => {
            navigation.dispatch(
                CommonActions.reset({
                    routes: [
                        {
                            index: 0,
                            name: MainStackNavsConst.HOME_TABS,
                        }
                    ]
                }),
            )
        }, 150);

        dispatch(authThunks.logout());

        setTimeout(() => {
            GlobalSpinnerService.setVisible(false)
        }, 200);
    }


    const clearUnreadMessages = () => {
        saveChatUnreadMessages({});
        dispatch(chatActions.SetUnreadMessages({}));
    }


    return (
        <SafeAreaView style={style.container}>
            <WillShowToast id={'settings'}/>
            <Space directions={'h'} size={'md'}/>
            <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                <IconButton onPress={navigation.goBack} btnStyle={[style.backButton, LocalizedLayout.ScaleX()]}
                            type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BackSvg stroke={Colors.N_BLACK} width={24} height={24}/>
                </IconButton>
                <DzText style={style.title}>
                    {I19n.t('الإعدادات')}
                </DzText>
                <View style={style.endPlaceholder}/>
            </View>
            <View style={{height: 26}}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Settings />
            </ScrollView>
            <View style={{height: 26}}/>
            {
                (isAuthenticated) &&
                <Touchable style={style.signOutBtn} onPress={onPressLogout}>
                    <DzText style={style.signOutText}>
                        {I19n.t('تسجيل الخروج')}
                    </DzText>
                </Touchable>
            }
            {
                (showDeleteAccount) &&
                <>
                    <View style={{height: 26}}/>
                    <Touchable style={style.signOutBtn} onPress={onPressLogout}>
                        <DzText style={style.signOutText}>
                            {I19n.t('حذف الحساب')}
                        </DzText>
                    </Touchable>
                </>
            }
            <Space directions={'h'} size={'md'}/>
        </SafeAreaView>
    );
};

export default SettingsContainer;
