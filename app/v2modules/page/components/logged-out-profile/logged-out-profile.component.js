import React, { useState } from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import LogoIcon from 'assets/icons/Logo.svg';

import { loggedOutProfileStyle as style } from './logged-out-profile.component.style';
import Settings from "v2modules/page/components/settings/settings.component";
import {LayoutStyle} from "deelzat/style";
import {Touchable} from "deelzat/v2-ui";
import I19n from "dz-I19n";
import AuthModalService from "modules/auth/modals/auth/auth.modal.service";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import AuthModal from "modules/auth/modals/auth/auth.modal";
import {DzText} from "deelzat/v2-ui";
import GlobalSpinnerService from 'modules/main/components/global-spinner/global-spinner.service';

const LoggedOutProfile = () => {

    const onPressSignIn = () => {
        AuthModalService.setVisible({
            show: true,
            trackSource: {name: EVENT_SOURCE.MY_SHOP},
            onAuthSuccess: () => {
                GlobalSpinnerService.setVisible(true);
            }
        })
    }

    return (
        <SafeAreaView style={style.container}>
            <AuthModal />
            <View style={{height: 35}} />
            <LogoIcon width={80} height={80}/>
            <ScrollView style={{width: '100%'}} showsVerticalScrollIndicator={false}>
                <View style={{height: 33}} />
                <Settings showLanguageSeparately={true}/>
            </ScrollView>
            <View style={LayoutStyle.Flex} />
            <Touchable style={style.signInBtn} onPress={onPressSignIn}>
                <DzText style={style.signInText}>
                    {I19n.t('تسجيل الدخول')}
                </DzText>
            </Touchable>
            <View style={{height: 20}} />
        </SafeAreaView>
    );
};

export default LoggedOutProfile;
