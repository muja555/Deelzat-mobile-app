import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    TextInput,
    TouchableHighlight,
    View,
} from 'react-native';
import { Colors, Spacing } from 'deelzat/style';
import { Button, ButtonOptions, Space } from 'deelzat/ui';

import { authStyle as style } from './auth.component.style';
import {
    isValidAuthEmailOrMobile,
} from 'modules/auth/others/auth.utils';
import { isValidEmail } from 'deelzat/validation';
import PasswordLessWithSmsInput from 'modules/auth/inputs/password-less-with-sms.input';
import PasswordLessWithEmailInput from 'modules/auth/inputs/password-less-with-email.input';
import LoginWithSocialInput from 'modules/auth/inputs/login-with-social.input';
import Auth0Api from 'modules/auth/apis/auth0.api';
import AuthCodeVerificationModal from 'modules/auth/modals/auth-code-verification/auth-code-verification.modal';
import Toast from 'deelzat/toast';
import { authThunks } from 'modules/auth/stores/auth/auth.store';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import AppVersion from 'modules/main/components/app-version/app-version.component';
import Delete from 'assets/icons/Delete.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthMethodConst from 'modules/auth/constants/auth-method.const';
import { getValidMobileNumber, getErrorMessage } from 'modules/auth/others/auth.utils';
import { trackSignupAttempt, trackSignupFailed } from 'modules/analytics/others/analytics.utils';
import { isValidMobile } from 'modules/main/others/phone.utils';
import I19n from 'dz-I19n';
import { DzText, Touchable } from 'deelzat/v2-ui';
import * as Sentry from '@sentry/react-native';
import { geoSelectors } from 'v2modules/geo/stores/geo/geo.store';
import {
    getFirstAttemptTimestamp,
    getNumberOfAttempts,
    saveFirstAttemptTimestamp, saveNumberOfAttempts,
} from 'modules/auth/others/passwordless-attempts.localstore';
import { remoteConfig } from 'modules/root/components/remote-configs/remote-configs.component';
import RemoteConfigsConst from 'modules/root/constants/remote-configs.const';
import moment from 'moment-timezone';
import LogoHeader from 'assets/icons/DeelzatLogoColored.svg';
import { LayoutStyle } from 'deelzat/style/layout';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import AppInfoSectionsConst from 'v2modules/page/constants/app-info-sections.const';
import store from 'modules/root/components/store-provider/store-provider';
import GoogleSvg from 'assets/icons/Google.svg';
import AppleSvg from 'assets/icons/Apple.svg';
import FacebookSvg from 'assets/icons/Facebook.svg';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import LoginWithNativeFacebookInput from 'modules/auth/inputs/login-with-native-facebook.input';
import FetchFacebookProfileInput from 'modules/auth/inputs/fetch-facebook-profile.input';

const Auth = (props) => {

    const {
        onHide = () => {
        },
        onAuthSuccess = (loginMethod) => {
        },
    } = props;

    const insets = useSafeAreaInsets();

    const [codeVerificationMethod, codeVerificationMethodSet] = useState();
    const geoCountryCode = useSelector(geoSelectors.geoCountryCodeSelector);
    const dispatch = useDispatch();

    const [loading, loadingSet] = useState(false);
    const [authEmailMobile, authEmailMobileSet] = useState('');
    const [validAuthEmailMobile, validAuthEmailMobileSet] = useState(false);
    const [authCodeVerificationModalVisible, authCodeVerificationModalVisibleSet] = useState(false);

    const [isOverlayLoaderVisible, isOverlayLoaderVisibleSet] = useState(false);
    const [lastTimeStamp, lastTimeStampSet] = useState();
    const [numberOfAttempts, numberOfAttemptsSet] = useState(0);
    const [remainingLockTime, remainingLockTimeSet] = useState();
    const [defaultLimitAttempts] = useState(remoteConfig.getNumber(RemoteConfigsConst.PASSWORDLESS_LIMIT_PER_LOCK));
    const [defaultTimeLock] = useState(remoteConfig.getNumber(RemoteConfigsConst.PASSWORDLESS_LOCK_SECONDS) * 1000);


    const onPressSendCode = () => {

        if (!remainingLockTime) {

            sendVerificationCode();

            const _newTime = Date.now();
            const newAttempts = numberOfAttempts + 1;

            if (!numberOfAttempts || newAttempts >= defaultLimitAttempts) {
                saveFirstAttemptTimestamp(_newTime);
                lastTimeStampSet(_newTime);

                if (newAttempts >= defaultLimitAttempts) {
                    remainingLockTimeSet(0);
                }
            }

            saveNumberOfAttempts(newAttempts);
            numberOfAttemptsSet(newAttempts);
        }
    };


    const sendVerificationCode = () => {

        Keyboard.dismiss();
        if (isValidMobile(authEmailMobile, authEmailMobile?.startsWith('05') ? geoCountryCode : undefined)) {
            sendMobileVerificationCode();
        } else if (isValidEmail(authEmailMobile)) {
            sendEmailVerificationCode();
        }
    };

    const sendEmailVerificationCode = () => {

        (async () => {
            trackSignupAttempt(AuthMethodConst.EMAIL, authEmailMobile);
            try {
                const inputs = new PasswordLessWithEmailInput();
                inputs.email = authEmailMobile;
                loadingSet(true);
                const result = await Auth0Api.passwordLessWithEmail(inputs);
                codeVerificationMethodSet(AuthMethodConst.EMAIL);
                authCodeVerificationModalVisibleSet(true);
            } catch (e) {
                console.error(e);
                trackSignupFailed(AuthMethodConst.EMAIL, authEmailMobile, JSON.stringify(e));
                Toast.danger(getErrorMessage(e));
            } finally {
                loadingSet(false);
            }
        })();
    };

    const sendMobileVerificationCode = () => {

        (async () => {
            const phoneNumber = getValidMobileNumber(authEmailMobile);
            trackSignupAttempt(AuthMethodConst.SMS, phoneNumber);
            try {
                const inputs = new PasswordLessWithSmsInput();
                inputs.phoneNumber = phoneNumber;
                loadingSet(true);
                const result = await Auth0Api.passwordLessWithSMS(inputs);
                codeVerificationMethodSet(AuthMethodConst.SMS);
                authCodeVerificationModalVisibleSet(true);
            } catch (e) {
                console.error(e);
                trackSignupFailed(AuthMethodConst.SMS, phoneNumber, JSON.stringify(e));
                Toast.danger(getErrorMessage(e));
            } finally {
                loadingSet(false);
            }
        })();
    };


    const loginWithFacebook = () => {

        isOverlayLoaderVisibleSet(true);

        (async () => {
            try {

                await LoginManager.logInWithPermissions(
                    ['public_profile', 'email']
                );

                const result = await AccessToken.getCurrentAccessToken();
                const token = result?.accessToken;

                const profileInputs = new FetchFacebookProfileInput();
                profileInputs.accessToken = token;
                profileInputs.userId = result?.userID;
                const fbProfile = await Auth0Api.fetchFacebookProfile(profileInputs);

                const input = new LoginWithNativeFacebookInput();
                input.subjectToken = token;
                input.userProfile = JSON.stringify({
                    name: fbProfile?.name,
                    nickName: fbProfile?.name,
                    email: fbProfile?.email,
                    picture: fbProfile?.picture?.data?.url || fbProfile?.picture,
                });
                const auth0Result = await Auth0Api.loginWithNativeFacebook(input);
                await dispatch(authThunks.auth0Success(auth0Result));
                isOverlayLoaderVisibleSet(false);
                onHide();
                onAuthSuccess(AuthMethodConst.FACEBOOK);

            } catch (e) {

                isOverlayLoaderVisibleSet(false);

                console.warn(e);
                trackSignupFailed(AuthMethodConst.FACEBOOK);
                Toast.danger(I19n.t('نعتذر، خطأ ما قد حصل. يرجى المحاولة مرة أخرى في وقت لاحق'));
                Sentry.captureMessage('[auth-error] login with social: ' + JSON.stringify(e));
            }
        })();
    };

    const loginWithSocial = (socialOption) => {
        trackSignupAttempt(socialOption);
        (async () => {
            try {
                const inputs = new LoginWithSocialInput();
                inputs.connection = socialOption;
                loadingSet(true);
                const result = await Auth0Api.loginWithSocial(inputs);
                await dispatch(authThunks.auth0Success(result));
                onHide();
                onAuthSuccess(socialOption);
            } catch (e) {
                console.error(e);
                const errorMsg = e?.error || '';
                if (errorMsg !== 'a0.session.user_cancelled') {
                    trackSignupFailed(errorMsg, socialOption);
                    Toast.danger(I19n.t('نعتذر، خطأ ما قد حصل. يرجى المحاولة مرة أخرى في وقت لاحق'));
                    Sentry.captureMessage('[auth-error] login with social: ' + errorMsg);
                }
            } finally {
                loadingSet(false);
            }
        })();
    };

    const onAuthCodeVerificationSuccess = (loginOption) => {
        onHide();
        onAuthSuccess(loginOption);
    };


    useEffect(() => {
        // Init values for limit of passwordless attempts Timer
        (async () => {

            moment.locale('en');

            const _lastTimeStamp = await getFirstAttemptTimestamp() || Date.now();
            lastTimeStampSet(_lastTimeStamp);

            const _numberOfAttempts = await getNumberOfAttempts() || 0;
            numberOfAttemptsSet(_numberOfAttempts);

        })();
    }, []);

    // Set automatic lock on passwordless attempts
    useEffect(() => {

        if (!lastTimeStamp) {
            return;
        }

        const interval = setInterval(async () => {

            const _remaining = Date.now() - lastTimeStamp;

            if (remainingLockTime !== undefined && (_remaining > defaultTimeLock)) { // Lock time is up

                numberOfAttemptsSet(0);
                saveNumberOfAttempts(0);
                remainingLockTimeSet();

            } else if (remainingLockTime !== undefined) {

                remainingLockTimeSet(_remaining);
            } else if (numberOfAttempts >= defaultLimitAttempts) {
                remainingLockTimeSet(_remaining);
            }

        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [lastTimeStamp, numberOfAttempts, remainingLockTime]);


    useEffect(() => {
        if (authEmailMobile) {
            validAuthEmailMobileSet(isValidAuthEmailOrMobile(authEmailMobile, authEmailMobile?.startsWith('05') ? geoCountryCode : undefined));
        }
    }, [authEmailMobile, geoCountryCode]);


    const getLockTimeFormatted = () => {
        if (remainingLockTime !== undefined) {
            return moment(defaultTimeLock - remainingLockTime).format('mm:ss');
        }
    };


    const onPressTermsAndConditions = () => {

        const sections = store?.getState()?.persistentData?.staticContent || {};

        RootNavigation.push(MainStackNavsConst.INFO, {
            data: sections[AppInfoSectionsConst.TERMS_AND_CONDITIONS],
            title: I19n.t('الشروط والبنود'),
        });

        setTimeout(() => {
            onHide();
        }, 500);
    };


    const onPressPrivacyPolicy = () => {

        const sections = store?.getState()?.persistentData?.staticContent || {};

        RootNavigation.push(MainStackNavsConst.INFO, {
            data: sections[AppInfoSectionsConst.PRIVACY_POLICY],
            title: I19n.t('سياسة ديلزات'),
        });

        setTimeout(() => {
            onHide();
        }, 500);
    };


    return (
        <View style={LayoutStyle.Flex}>
            <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='always' keyboardDismissMode={'on-drag'}>
                <View
                    style={[style.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                    <AuthCodeVerificationModal
                        identifier={authEmailMobile}
                        authMethod={codeVerificationMethod}
                        isVisible={authCodeVerificationModalVisible}
                        onSuccess={onAuthCodeVerificationSuccess}
                        onHide={() => authCodeVerificationModalVisibleSet(false)}
                    />
                    <View style={style.contents}>
                        <View style={style.header}>
                            <TouchableHighlight
                                hitSlop={{ top: 100, bottom: 100, left: 100, right: 100 }}
                                activeOpacity={0.8}
                                underlayColor='#fff'
                                onPress={onHide}>
                                <Delete fill={Colors.GREY} width={16} height={16} />
                            </TouchableHighlight>
                        </View>
                        <Space size={'lg'} directions={'h'} />
                        <View style={Spacing.ItemsCenter}>
                            <LogoHeader style={style.logo} />
                        </View>
                        <Space size={'lg'} directions={'h'} />
                        <View>
                            <DzText style={style.title}>
                                {I19n.t('تسجيل الدخول')}
                            </DzText>
                        </View>
                        <Space size={'lg'} directions={'h'} />
                        <View style={style.socialBtnWrapper}>
                            <Touchable
                                style={style.socialBtn}
                                onPress={() => loginWithSocial(AuthMethodConst.GOOGLE)}>
                                <GoogleSvg style={style.socialIcon} />
                            </Touchable>
                            <Touchable
                                style={style.socialBtnFacebook}
                                onPress={loginWithFacebook}>
                                <FacebookSvg style={style.socialIcon} />
                            </Touchable>
                            <Touchable
                                style={style.socialBtnApple}
                                onPress={() => loginWithSocial(AuthMethodConst.APPLE)}>
                                <AppleSvg style={style.socialIcon} />
                            </Touchable>
                        </View>
                        <Space size={'lg'} directions={'h'} />
                        <View style={style.orLine}>
                            <View style={style.orLineTextWrapper}>
                                <DzText> {I19n.t('أو')} </DzText>
                            </View>
                        </View>
                        <Space size={'lg'} directions={'h'} />
                        <DzText style={style.inputLabel}> {I19n.t('بريد إلكتروني / رقم هاتف محمول')} </DzText>
                        <Space directions={'h'} />

                        <KeyboardAvoidingView>
                            <TextInput
                                style={style.input}
                                autoCapitalize='none'
                                blurOnSubmit={true}
                                onChangeText={text => authEmailMobileSet(text?.trim())}
                                placeholder={'example@domain.com'}
                                value={authEmailMobile} />
                        </KeyboardAvoidingView>
                        <Space size={'lg'} directions={'h'} />
                        <View style={style.legalTermsText}>
                            <Touchable disabled={true}>
                                <DzText style={style.signinForTerms1}>
                                    {I19n.t('SIGNING_TERMS_TEXT_1')}
                                </DzText>
                            </Touchable>
                            <Touchable>
                                <DzText style={style.signinForTerms2} onPress={onPressTermsAndConditions}>
                                    {I19n.t('SIGNING_TERMS_TEXT_2')}
                                </DzText>
                            </Touchable>
                            <Touchable disabled={true}>
                                <DzText style={style.signinForTerms1}>
                                    {I19n.t('SIGNING_TERMS_TEXT_3')}
                                </DzText>
                            </Touchable>
                            <Touchable>
                                <DzText style={style.signinForTerms2} onPress={onPressPrivacyPolicy}>
                                    {I19n.t('SIGNING_TERMS_TEXT_4')}
                                </DzText>
                            </Touchable>
                        </View>
                        <Space size={'md'} directions={'h'} />
                        <Button
                            onPress={onPressSendCode}
                            disabled={loading || !validAuthEmailMobile || !!remainingLockTime}
                            type={validAuthEmailMobile ? ButtonOptions.Type.PRIMARY : ButtonOptions.Type.MUTED}
                            text={I19n.t('أرسل رمز التفعيل')}
                        />
                        {
                            (remainingLockTime !== undefined) &&
                            <DzText style={style.lockPasswordlesTimer}>
                                {getLockTimeFormatted()}
                            </DzText>
                        }
                        <AppVersion />
                        {
                            loading &&
                            <ActivityIndicator style={style.loadingIndicator} size='large' color={Colors.CERULEAN_BLUE} />
                        }
                    </View>
                </View>
            </KeyboardAwareScrollView>
            {
                (isOverlayLoaderVisible) &&
                <View style={[style.overlayLoaderView]}>
                    <ActivityIndicator size='large' color={'white'} />
                </View>
            }
        </View>
    );
};

export default Auth;
