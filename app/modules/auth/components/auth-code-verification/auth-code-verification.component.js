import React, {useEffect, useState} from 'react';
import {Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, View} from 'react-native';
import {authCodeVerificationStyle as style} from './auth-code-verification.component.style';
import {Button, ButtonOptions, Space} from "deelzat/ui";
import {isValidVerificationCode} from "deelzat/validation";
import LoginWithSmsInput from "modules/auth/inputs/login-with-sms.input";
import LoginWithEmailInput from "modules/auth/inputs/login-with-email.input";
import Auth0Api from "modules/auth/apis/auth0.api";
import Toast from "deelzat/toast";
import {useDispatch} from "react-redux";
import {authThunks} from "modules/auth/stores/auth/auth.store";
import AuthMethodConst from "modules/auth/constants/auth-method.const";
import {getErrorMessage, getValidMobileNumber} from "modules/auth/others/auth.utils";
import {setUserProperty, trackSignupFailed} from "modules/analytics/others/analytics.utils";
import USER_PROP from "modules/analytics/constants/analytics-user-propery.const";
import I19n from 'dz-I19n';
import {DzText} from "deelzat/v2-ui";

const AuthCodeVerification = (props) => {

    const {

        identifier ='',
        authMethod,
        onHide = () => {},
        onSuccess = (loginMethod) => {}
    } = props;

    const dispatch = useDispatch();

    const [code, codeSet] = useState('');
    const [loading, loadingSet] = useState(false);
    const [validCode, validCodeSet] = useState(false);

    const login = () => {

        if(!isValidVerificationCode(code)) {
            return;
        }

        if(authMethod === AuthMethodConst.SMS) {
            loginWithSMS();
        }
        else if(authMethod === AuthMethodConst.EMAIL) {
            loginWithEmail();
        }
    };
    const loginWithEmail = () => {
        loadingSet(true);
        (async () => {
            try {
                const inputs = new LoginWithEmailInput();
                inputs.code = code;
                inputs.email =  identifier;
                const result = await Auth0Api.loginWithEmail(inputs);

                Keyboard.dismiss();
                await dispatch(authThunks.auth0Success(result));
                onSuccess(authMethod);

                setUserProperty(USER_PROP.LOGIN_EMAIL, identifier);
            }
            catch (e) {
                console.error(e);
                trackSignupFailed(authMethod, null, e?.message);
                Toast.danger(getErrorMessage(e));
            }
            finally {
                loadingSet(false);
            }
        })();

    };

    const loginWithSMS = () => {
        loadingSet(true);
        (async () => {
            try {
                const inputs = new LoginWithSmsInput();
                inputs.code = code;
                inputs.phoneNumber = getValidMobileNumber(identifier)
                const result = await Auth0Api.loginWithSMS(inputs);

                Keyboard.dismiss();
                await dispatch(authThunks.auth0Success(result));
                onSuccess(authMethod);

                setUserProperty(USER_PROP.LOGIN_MOBILE, identifier);
            }
            catch (e) {
                console.warn(e);
                trackSignupFailed(authMethod, null, e?.message);
                Toast.danger(getErrorMessage(e));
            }
            finally {
                loadingSet(false);
            }
        })();

    };

    useEffect(() => {
        validCodeSet(isValidVerificationCode(code))
    }, [code]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'none'}
                              style={style.container}>
            <View style={Platform.OS === 'ios' && {paddingBottom: 30}}>

                <DzText style={style.inputLabel}>{I19n.t('تم إرسال رمز التفعيل الخاص بك، يرجى إدخال الرمز')}</DzText>
                <Space directions={'h'}/>
                <TextInput
                    style={style.input}
                    onChangeText={text => codeSet(text)}
                    placeholder={'123456'}
                    keyboardType={'number-pad'}
                    returnKeyType={'done'}
                    onSubmitEditing={login}
                    value={code}/>
                <Space size={'md'} directions={'h'}/>
                <Button
                    loading={loading}
                    onPress={login}
                    disabled={loading || !validCode}
                    size={ButtonOptions.Size.LG}
                    type={validCode ? ButtonOptions.Type.PRIMARY : ButtonOptions.Type.MUTED}
                    text={I19n.t('تحقق')}
                />
                <Space directions={'h'}/>
                <Button
                    onPress={onHide}
                    disabled={loading}
                    type={ButtonOptions.Type.MUTED_OUTLINE}
                    text={I19n.t('إلغاء')}
                    btnStyle={style.cancelBtn}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

export default AuthCodeVerification;
