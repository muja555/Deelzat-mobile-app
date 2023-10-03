import React from 'react';
import {Text, SafeAreaView, KeyboardAvoidingView} from 'react-native';

import {authRequiredStyle as style} from './auth-required.component.style';
import {Button, ButtonOptions, Space} from "deelzat/ui";
import AuthModalService from "modules/auth/modals/auth/auth.modal.service";
import I19n from "dz-I19n";
import {DzText} from "deelzat/v2-ui";

const AuthRequired = (props) => {

    const {
        message = '',
        trackSource,
        onHide = () => {},
        onAuthSuccess = () => {}
    } = props;


    const openLoginModal = () => {
        AuthModalService.setVisible({
            show: true,
            onHide: onHide,
            onAuthSuccess: onAuthSuccess,
            trackSource
        })
    };


    return (
        <SafeAreaView style={style.container}>
            <KeyboardAvoidingView style={style.innerContainer}>
                <DzText style={style.title}>
                    {message}
                </DzText>
                <Space directions={'h'} size={'lg'}/>
                <Button
                    onPress={openLoginModal}
                    btnStyle={style.button}
                    size={ButtonOptions.Size.LG}
                    type={ButtonOptions.Type.PRIMARY}
                    text={I19n.t('سجل الآن، أنشىء حسابك')}
                />
                <Space directions={'h'}/>
                <Button
                    onPress={onHide}
                    btnStyle={style.button}
                    type={ButtonOptions.Type.MUTED_OUTLINE}
                    text={I19n.t('إلغاء')}
                />
                <Space directions={'h'}/>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AuthRequired;
