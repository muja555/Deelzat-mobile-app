import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    BackHandler,
    Image,
    Platform,
    TextInput, TouchableWithoutFeedback,
} from 'react-native';
import omit from 'lodash/omit';
import PagerView from '@deelzat/react-native-pager-view';
import { editProfileContainerStyle as style } from './edit-profile.container.style';
import { Button, ButtonOptions, Space } from 'deelzat/ui';
import { Colors, Font, LayoutStyle, Spacing } from 'deelzat/style';
import { DzText, ImageWithBlur, Touchable } from 'deelzat/v2-ui';
import FrameIcon from 'assets/icons/ImageFrameSmall.png';
import ShopImage from 'v2modules/shop/components/shop-image/shop-image.component';
import CameraIcon from 'assets/icons/Camera2.svg';
import useActionSheetModal from 'v2modules/shared/modals/action-sheet/action-sheet.modal';
import I19n from 'dz-I19n';
import ShopApi from 'modules/shop/apis/shop.api';
import * as Actions from 'modules/shop/stores/shop/shop.actions';
import * as AuthActions from 'modules/auth/stores/auth/auth.actions';
import {
    trackChangeProfileAvatar,
    trackChangeProfileTheme,
    trackClickOnPageTab,
    trackEditShopFailed,
    trackEditShopSuccess,
    trackShopImageChanged,
    trackShopImageDeleted, trackViewScreen,
} from 'modules/analytics/others/analytics.utils';
import EditIcon from 'assets/icons/Edit2.svg';
import { shopThunks } from 'modules/shop/stores/shop/shop.store';
import { choseFromImageLibrary } from 'modules/main/others/images.utils';
import FileApi from 'modules/file/apis/file.api';
import ImageUploadInput from 'modules/file/inputs/image-upload.input';
import ShopEditInput from 'modules/shop/inputs/shop-edit.input';
import Toast from 'deelzat/toast';
import { useDispatch, useSelector } from 'react-redux';
import { authSelectors, authThunks } from 'modules/auth/stores/auth/auth.store';
import { validateFields } from 'modules/shop/components/shop-edit/shop-edit.utils';
import {
    getBtnStyleFrom, getBtnTextStyleFrom,
    isEmptyValues,
    refactorImageUrl,
    shareApiError,
} from 'modules/main/others/main-utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EVENT_SOURCE from 'modules/analytics/constants/analytics-event-source.const';
import * as Sentry from '@sentry/react-native';
import UsernameAvailabilityConst from 'v2modules/shop/constants/username-availability.const';
import EditProfileTabs from 'v2modules/shop/components/edit-profile-tabs/edit-profile-tabs.component';
import EditProfileTabConst from 'v2modules/shop/constants/edit-profile-tab.const';
import EditProfile from 'v2modules/shop/components/edit-profile/edit-profile.component';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import EditProfileFieldName from 'v2modules/shop/constants/edit-profile-field-names.const';
import CustomizeProfile from 'v2modules/shop/components/customize-profile/customize-profile.component';
import WillShowToast from 'deelzat/toast/will-show-toast';
import UserInfoUpdateInput from 'modules/main/inputs/user-info-update.input';
import UserInfoApi from 'modules/main/apis/user-info.api';
import isEqual from "lodash/isEqual";


const DESC_LIMIT = 150;
const ActionSheetModal = useActionSheetModal();
const trackSource = { name: EVENT_SOURCE.MY_SHOP };
const EditProfileContainer = (props) => {
    const {
        shop = {},
        initialTheme,
        showShopNameField = false,
    } = props.route?.params || {};


    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    const authState = useSelector(authSelectors.authStateSelector);

    const [tabs] = useState([EditProfileTabConst.EDIT_INFO, EditProfileTabConst.CUSTOMIZATION]);
    const [currentTab, currentTabSet] = useState(EditProfileTabConst.EDIT_INFO);
    const [headerHeight, headerHeightSet] = useState(250);

    const [fieldValues, fieldValuesSet] = useState({});
    const defaultFieldValues = useRef();
    const [fieldErrors, fieldErrorsSet] = useState({});

    const [selectedTheme, selectedThemeSet] = useState(initialTheme);

    const [isSubmitting, isSubmittingSet] = useState(false);

    // to render loader on either change image btn or delete btn
    const [isDeletingImage, isDeletingImageSet] = useState(false);

    const [shopImage, shopImageSet] = useState(shop?.user?.picture ?? shop?.picture);
    const [isEditingDescription, isEditingDescriptionSet] = useState(false);

    const editProfileRef = useRef();
    const tabsPagerRef = useRef();

    const descriptionFieldRef = useRef();
    const usernameAlreadyChecked = useRef();


    useEffect(() => {

        const defaultCountry = editProfileRef?.current?.getDefaultCountry();

        const _fieldValues = {
            [EditProfileFieldName.FIRST_NAME]: shop?.user?.firstName,
            [EditProfileFieldName.LAST_NAME]: shop?.user?.lastName,
            [EditProfileFieldName.STORE_NAME]: showShopNameField ? shop?.name?.trim() : ' ',
            [EditProfileFieldName.USERNAME]: shop?.username,
            [EditProfileFieldName.MOBILE_NUM]: shop?.user?.mobileNumber || authState?.auth0User?.phone_number,
            [EditProfileFieldName.WHATSAPP_NUM]: shop?.extra_data?.whatsapp_number,
            [EditProfileFieldName.EMAIL]: shop?.user?.email || authState?.auth0User?.email,
            [EditProfileFieldName.CITY]: shop?.address?.city,
            [EditProfileFieldName.COUNTRY]: shop?.address?.country || defaultCountry?.['ar'],
            [EditProfileFieldName.STREET]: shop?.address?.street,
            [EditProfileFieldName.PICTURE]: shop?.user?.picture,
            [EditProfileFieldName.DESCRIPTION]: shop?.extra_data?.description,
        };

        defaultFieldValues.current = _fieldValues;
        fieldValuesSet(_fieldValues);

        if (!!_fieldValues[EditProfileFieldName.USERNAME] && _fieldValues[EditProfileFieldName.USERNAME] !== '') {
            usernameAlreadyChecked.current = true;
        }
    }, []);


    const setField = useCallback((key, value) => {

        const newFieldValues = { ...fieldValues };
        newFieldValues[key] = value;
        if (key === EditProfileFieldName.COUNTRY) {
            newFieldValues[EditProfileFieldName.CITY] = undefined;
        }
        if (key === EditProfileFieldName.USERNAME) {
            usernameAlreadyChecked.current = false;
        }

        fieldValuesSet(newFieldValues);
        if (fieldErrors[key]) {
            fieldErrorsSet({...fieldErrors, [key]: undefined});
        }
    }, [fieldErrors, fieldValues]);


    const validate = () => {


        // If user changed nothing from data neither theme id then
        const fieldsAreChanged = isEqual(defaultFieldValues.current, fieldValues);
        if (fieldsAreChanged && initialTheme?.id === selectedTheme?.id) {

            RootNavigation.goBack();
            return;
        }

        const usernameFieldStatus = editProfileRef?.current?.getUsernameFieldStatus();

        const fields = { ...fieldValues };
        if (showShopNameField) {
            fields[EditProfileFieldName.STORE_NAME] = fields[EditProfileFieldName.STORE_NAME]?.trim();
        }
        fields[EditProfileFieldName.FIRST_NAME] = fields[EditProfileFieldName.FIRST_NAME]?.trim();
        fields[EditProfileFieldName.LAST_NAME] = fields[EditProfileFieldName.LAST_NAME]?.trim();

        const _fieldsErrors = validateFields(fields);
        fieldErrorsSet(_fieldsErrors);

        const usernameValid =
            usernameAlreadyChecked.current || usernameFieldStatus === UsernameAvailabilityConst.AVAILABLE;


        if (isEmptyValues(_fieldsErrors) && usernameValid) {
            submitShop(fields);
        } else if (isEmptyValues(_fieldsErrors) && usernameValid) {
            editProfileRef?.current?.checkUserNameIfAvailable().then((isAvailable) => {
                if (isAvailable) {
                    submitShop(fields);
                }
            });
        } else {
            tabsPagerRef?.current?.setPage(tabs.indexOf(EditProfileTabConst.EDIT_INFO));
            currentTabSet(EditProfileTabConst.EDIT_INFO);
            Toast.danger(I19n.t('الرجاء تعبئة جميع الحقول بطريقة صحيحة'));
        }
    };


    const submitShop = () => {

        const selectedCountry = editProfileRef?.current?.getSelectedCountry();

        isSubmittingSet(true);
        (async () => {
            try {
                const inputs = new ShopEditInput();
                inputs.countryCode = selectedCountry.code;
                inputs.fields = { ...fieldValues, picture: shopImage };
                inputs.themeId = selectedTheme?.id;
                const result = await ShopApi.edit(inputs);
                await dispatch(authThunks.loadAuth0User());
                isSubmittingSet(false);
                trackEditShopSuccess(trackSource);
                RootNavigation.goBack();

                dispatch(Actions.SetTheme(selectedTheme));

            } catch (e) {
                isSubmittingSet(false);

                let errorString;
                if (e?.data?.full_messages?.length > 0) {
                    errorString = e?.data?.full_messages;
                }

                Toast.danger(errorString || I19n.t('حصل خطأ ما'));
                console.error(JSON.stringify(e));
                trackEditShopFailed(e?.data?.message, trackSource);

                try {
                    Sentry.captureException(e);
                } catch (x) {
                }
                try {
                    Sentry.captureMessage('[api-error] profile error: ' + (errorString || JSON.stringify(e)));
                } catch (x) {
                }
            }
        })();
    };


    const openImageLibrary = async () => {
        const image = await choseFromImageLibrary(false, 0.6)
            .catch(console.warn);
        try {
            isSubmittingSet(true);
            isDeletingImageSet(false);

            const signedUrlResult = await FileApi.imageSignedUrlGet();
            const inputs = new ImageUploadInput();
            inputs.signedUrl = signedUrlResult.url;
            inputs.base64 = image.data;
            await FileApi.imageUpload(inputs);
            submitNewImage(inputs.getImageUrl());
        } catch (e) {
            console.warn(e);
            isSubmittingSet(false);
            onHide();
        }
    };


    const submitNewImage = (newImageUrl) => {

        const selectedCountry = editProfileRef?.current?.getSelectedCountry();
        isSubmittingSet(true);

        isDeletingImageSet(!newImageUrl);
        const _currentImage = shopImage;
        shopImageSet(newImageUrl);

        if (shop?.id) {

            const _shop = { ...shop };
            const inputs = new ShopEditInput();
            _shop.user.picture = newImageUrl;
            inputs.shopData = _shop;
            inputs.countryCode = selectedCountry.code;
            ShopApi.edit(inputs)
                .then(() => {
                    if (newImageUrl) {
                        trackShopImageChanged(_shop);
                    } else {
                        trackShopImageDeleted(_shop);
                    }
                    isSubmittingSet(false);
                    onHide();
                    dispatch(shopThunks.loadShop(_shop));
                })
                .catch((e) => {

                    shopImageSet(_currentImage);

                    shareApiError(e, 'edit profile error');

                    e?.data?.message && Toast.danger(e.data.message);
                    console.warn(e);
                    isSubmittingSet(false);
                    onHide();
                });
        }
        else {

            const input = new UserInfoUpdateInput();
            const userData = shop?.user || {};
            input.metadata = {
                ...userData,
                firstName: userData.firstName || ' ',
                lastName: userData.lastName || ' ',
                picture: newImageUrl
            };

            UserInfoApi.updateUserInfo(input)
                .then((result) => {

                    // Refresh my-profile
                    dispatch(AuthActions.SetAuth0User({...authState.auth0User}));
                    isSubmittingSet(false);
                    onHide();
                })
                .catch((e) => {

                    shopImageSet(_currentImage);

                    console.warn(e);
                    isSubmittingSet(false);
                    onHide();
                });

        }
    };


    const onImagePressed = () => {
        isEditingDescriptionSet(false);
        ActionSheetModal.show(true);
    };


    const onHide = () => {
        ActionSheetModal.show(false);
    };


    const onPressEditAbout = () => {
        isEditingDescriptionSet(true);
        setTimeout(() => {
            descriptionFieldRef.current?.focus();
        }, 100);
    };


    const onPressTab = useCallback(
        (tabKey) => {
            trackClickOnPageTab(tabKey);
            tabsPagerRef.current.setPage(tabs.indexOf(tabKey));
            currentTabSet(tabKey);
        },
        [tabs],
    );


    useEffect(() => {
        isEditingDescriptionSet(false);
        trackViewScreen(currentTab);
    }, [currentTab]);


    const onFocusField = useCallback(() => {
        isEditingDescriptionSet(false);
    }, []);


    const onSelectTheme = useCallback((theme) => {
        selectedThemeSet(theme);
        isEditingDescriptionSet(false);

        trackChangeProfileTheme(theme?.id || 'default');
    }, []);


    const onSelectAvatar = useCallback((avatarUrl) => {
        shopImageSet(avatarUrl);
        submitNewImage(avatarUrl);

        trackChangeProfileAvatar(avatarUrl);
    }, [shop]);


    const onLayout = useCallback(({ nativeEvent: { layout: { height } } }) => {
        headerHeightSet(height);
    }, []);


    return (
        <TouchableWithoutFeedback onPress={onFocusField}>
            <View style={[LayoutStyle.Flex, !selectedTheme && {backgroundColor: 'white'}]}>
                <WillShowToast id={'edit-profile'}/>
                {
                    (selectedTheme) &&
                    <ImageWithBlur style={{ width: '100%', height: headerHeight + 60 }}
                                   useFastImage={true}
                                   imageUrl={refactorImageUrl(selectedTheme.background_url, 0)}
                                   thumbnailUrl={refactorImageUrl(selectedTheme.background_url, 1)}
                    />
                }
                <View style={style.container}>
                    <ActionSheetModal.Modal onHide={onHide}>
                        <View>
                            <Button
                                btnStyle={style.changeImageBtn}
                                textStyle={Font.Bold}
                                loading={isSubmitting && !isDeletingImage}
                                disabled={isSubmitting}
                                onPress={openImageLibrary}
                                size={ButtonOptions.Size.LG}
                                text={I19n.t('تغيير الصورة')}
                            />
                            <Space directions={'h'} size={'md'} />
                            <Button
                                btnStyle={style.deleteImageBtn}
                                textStyle={Font.Bold}
                                onPress={() => submitNewImage()}
                                loading={isSubmitting && isDeletingImage}
                                disabled={isSubmitting}
                                size={ButtonOptions.Size.LG}
                                text={I19n.t('حذف الصورة')}
                            />
                        </View>
                    </ActionSheetModal.Modal>
                    <View onLayout={onLayout}>
                        <View style={{ height: insets.top }} />
                        <Space directions={'h'} size={'md'} />
                        <View style={LayoutStyle.AlignItemsCenter}>
                            <Touchable style={style.imageView} onPress={onImagePressed}>
                                <Image source={FrameIcon} style={[style.frame, selectedTheme && {tintColor: selectedTheme.color1}]} tintColor={selectedTheme?.color1} />
                                <ShopImage image={shopImage} resizeMethod='scale' style={style.profileImage} />
                                <View style={style.editImage}>
                                    <CameraIcon stroke={selectedTheme?.color2 || Colors.MAIN_COLOR}/>
                                </View>
                            </Touchable>
                        </View>
                        <Space directions={'h'} size={'md'} />
                        <Touchable onPress={onPressEditAbout} disabled={isEditingDescription}
                                   style={Spacing.HorizontalPadding}>
                            {!isEditingDescription && (
                                <View style={style.aboutView}>
                                    <View style={{ width: 14, height: 14 }} />
                                    <DzText style={[style.aboutText, LayoutStyle.Flex]}>
                                        {fieldValues[EditProfileFieldName.DESCRIPTION] ||
                                        I19n.t('قم بتعديل تفاصيل الحساب لتتمكن من إضافة وصف خاص بك.') + ' '}
                                    </DzText>
                                    <View style={style.aboutEditIcon}>
                                        <EditIcon stroke={!isEditingDescription ? (selectedTheme?.color2 || Colors.MAIN_COLOR) : 'transparent'} />
                                    </View>
                                </View>
                            )}
                            {isEditingDescription && (
                                <TextInput
                                    style={style.aboutText}
                                    multiline={true}
                                    value={fieldValues[EditProfileFieldName.DESCRIPTION]}
                                    onChangeText={(value) =>
                                        setField(EditProfileFieldName.DESCRIPTION, value.substring(0, Math.min(value.length, DESC_LIMIT)))
                                    }
                                    blurOnSubmit={true}
                                    ref={descriptionFieldRef}
                                    onBlur={() => isEditingDescriptionSet(false)}
                                />
                            )}
                        </Touchable>
                        <Space directions={'h'} size={'md'} />
                        <View style={[LayoutStyle.Row, LayoutStyle.JustifyContentCenter]}>
                            <Button
                                btnStyle={[style.headerBtn, getBtnStyleFrom(selectedTheme, true)]}
                                type={ButtonOptions.Type.PRIMARY}
                                onPress={validate}
                                disabled={isSubmitting}
                                loading={isSubmitting}
                                loadingColor={'white'}
                                size={ButtonOptions.Size.SM}
                                textStyle={[style.headerBtnText, getBtnTextStyleFrom(selectedTheme, true)]}
                                text={I19n.t('حفظ')}
                            />
                            <Space directions={'v'} size={['sm', '']} />
                            <Button
                                btnStyle={[style.headerBtn, getBtnStyleFrom(selectedTheme)]}
                                type={ButtonOptions.Type.PRIMARY_OUTLINE}
                                onPress={RootNavigation.goBack}
                                size={ButtonOptions.Size.SM}
                                disabled={isSubmitting}
                                textStyle={[style.headerBtnText, getBtnTextStyleFrom(selectedTheme)]}
                                text={I19n.t('إلغاء')}
                            />
                        </View>
                        <Space directions={'h'} size={'md'} />
                    </View>
                    <EditProfileTabs tabs={tabs}
                                     selectedTheme={selectedTheme}
                                     currentTab={currentTab}
                                     onPressTab={onPressTab} />

                    <PagerView
                        style={style.navigator}
                        scrollEnabled={false}
                        ref={tabsPagerRef}
                        collapsable={false}
                        initialPage={0}
                    >
                        <View style={[LayoutStyle.Flex, Spacing.HorizontalPadding]} key={EditProfileTabConst.EDIT_INFO}>
                            <EditProfile
                                ref={editProfileRef}
                                fieldValues={fieldValues}
                                fieldErrors={fieldErrors}
                                showShopNameField={showShopNameField}
                                userId={authState?.auth0User?.userId}
                                setField={setField}
                                onFocusField={onFocusField}
                            />
                        </View>
                        <View style={LayoutStyle.Flex} key={EditProfileTabConst.CUSTOMIZATION}>
                            <CustomizeProfile
                                withThemes={!!shop?.id}
                                selectedTheme={selectedTheme}
                                onSelectAvatar={onSelectAvatar}
                                onSelectTheme={onSelectTheme} />
                        </View>
                    </PagerView>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default EditProfileContainer;










