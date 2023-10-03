import React, { useCallback, useRef, useState } from 'react';
import { View, FlatList } from 'react-native';

import { customizeProfileStyle as style } from './customize-profile.component.style';
import { remoteConfig } from 'modules/root/components/remote-configs/remote-configs.component';
import RemoteConfigsConst from 'modules/root/constants/remote-configs.const';
import { DzText, ImageWithBlur, Touchable } from 'deelzat/v2-ui';
import { refactorImageUrl } from 'modules/main/others/main-utils';
import { Space } from 'deelzat/ui';
import LottieView from 'lottie-react-native';
import I19n from 'dz-I19n';
import { Colors, LayoutStyle, LocalizedLayout } from 'deelzat/style';
import useMidViewModal from 'v2modules/shared/modals/mid-view/mid-view.modal';
import { trackClickOnThemePreview } from 'modules/analytics/others/analytics.utils';

let CheckAnim;
const MARGIN = 20;
const ANIM_COLORS_FILTERS = [{
    keypath: 'check-circle Outlines',
    color: '#ffffff',
}];
const MidViewModal = useMidViewModal();
const CustomizeProfile = (props) => {
    const {
        selectedTheme,
        withThemes = false,
        onSelectTheme = (theme) => {},
        onSelectAvatar = (avatarUrl) => {},
    } = props;

    const animViewRef = useRef([]);
    const animDefaultViewRef = useRef();
    const [previewImage, previewImageSet] = useState();
    const [allThemes] = useState(JSON.parse(remoteConfig.getValue(RemoteConfigsConst.PROFILE_THEMES).asString()));
    const [allAvatars] = useState(JSON.parse(remoteConfig.getValue(RemoteConfigsConst.DEFAULT_AVATARS).asString()));

    if (!CheckAnim) {
        CheckAnim = require('assets/anim/radioButton');
    }

    const renderItem = useCallback(({ item, index }) => {

        const onPressTheme = () => {
            previewImageSet(item?.preview_url);
            setTimeout(() => {
                MidViewModal.show();
            }, 100);

            trackClickOnThemePreview(item?.id);
        };

        const onPressButton = () => {
            animViewRef.current[index].play();
            setTimeout(() => {
                onSelectTheme(item);
            }, 350);
        };

        return (
            <View style={[
                withThemes? style.itemContainer: style.itemContainerBigAvatar,
                index % 2 === 0? {marginStart: MARGIN}: {marginEnd: MARGIN}
            ]}>
                {
                    (withThemes) &&
                        <>
                            <Touchable onPress={onPressTheme}>
                                <ImageWithBlur
                                    style={style.themeImage}
                                    resizeMode='cover'
                                    resizeMethod='resize'
                                    thumbnailUrl={refactorImageUrl(item.background_url, 1)}
                                    imageUrl={refactorImageUrl(item.background_url, 0)} />
                            </Touchable>
                            <Space directions={'h'} sizes={'sm'} />
                            <Touchable onPress={onPressButton}
                                       style={[style.themeBtn, { backgroundColor: item.color1 }]}>
                                <LottieView source={CheckAnim}
                                            ref={ref => animViewRef.current[index] = ref}
                                            autoPlay={false}
                                            speed={1.3}
                                            progress={selectedTheme?.id === item?.id ? 1 : 0}
                                            colorFilters={ANIM_COLORS_FILTERS}
                                            style={style.checkAnim}
                                            loop={false} />
                                <View style={{ width: 10 }} />
                            </Touchable>
                        </>
                }
                {
                    (!withThemes) &&
                    <Touchable onPress={() => onSelectAvatar(item)}>
                        <ImageWithBlur
                            style={style.bigAvatar}
                            resizeMode='cover'
                            resizeMethod='resize'
                            thumbnailUrl={refactorImageUrl(item, 1)}
                            imageUrl={refactorImageUrl(item, 0)} />
                    </Touchable>
                }
            </View>
        );
    }, [selectedTheme]);


    const ListHeaderComponent = useCallback(() => {

        const renderItem = ({ item, index }) => {
            return (
                <Touchable onPress={() => onSelectAvatar(item)}>
                    <ImageWithBlur
                        style={style.avatarImage}
                        resizeMode='cover'
                        resizeMethod='resize'
                        thumbnailUrl={refactorImageUrl(item, 1)}
                        imageUrl={refactorImageUrl(item, style.avatarImage.width)} />
                </Touchable>
            );
        };

        const keyExtractor = (item, index) => `${index}`;

        if (withThemes) {
            return (
                <View>
                    <DzText style={[style.sectionTitle, LocalizedLayout.TextAlignRe(), {marginHorizontal: MARGIN}]}>
                        {I19n.t('أفاتار')}
                    </DzText>
                    <View style={{ height: 13.8 }} />
                    <FlatList
                        data={allAvatars}
                        renderItem={renderItem}
                        initialScrollIndex={0}
                        initialNumToRender={100}
                        contentContainerStyle={{paddingStart: MARGIN, paddingEnd: MARGIN}}
                        keyExtractor={keyExtractor}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
                        horizontal={true} />
                    <View style={{ height: 25 }} />
                    <DzText style={[style.sectionTitle, LocalizedLayout.TextAlignRe(), {marginHorizontal: MARGIN}]}>
                        {I19n.t('ثيمات')}
                    </DzText>
                    <View style={{ height: 13.8 }} />
                </View>
            );
        }

        return (
            <View>
                <DzText style={[style.sectionTitle, LocalizedLayout.TextAlignRe(), {marginHorizontal: MARGIN}]}>
                    {I19n.t('أفاتار')}
                </DzText>
                <View style={{ height: 13.8 }} />
            </View>
        )
    }, []);


    const ListFooterComponent = useCallback(() => {

        const onPress = () => {
            animDefaultViewRef.current.play();
            setTimeout(() => {
                onSelectTheme();
            }, 350);
        };

        if (withThemes) {
            return (
                <View>
                    <Space directions={'h'} size={'md'} />
                    <Touchable onPress={onPress}
                               style={[style.themeBtn, { backgroundColor: Colors.MAIN_COLOR, marginHorizontal: MARGIN, }]}>
                        <DzText style={style.resetBtnText}>
                            {I19n.t('إعادة الضبط للواجهة الرئيسية')}
                        </DzText>
                        <LottieView source={CheckAnim}
                                    ref={ref => animDefaultViewRef.current = ref}
                                    autoPlay={false}
                                    speed={1.3}
                                    progress={!selectedTheme ? 1 : 0}
                                    colorFilters={ANIM_COLORS_FILTERS}
                                    style={style.checkAnim}
                                    loop={false} />
                        <View style={{ width: 10 }} />
                    </Touchable>
                    <Space directions={'h'} size={'lg'} />
                </View>
            );
        }

        return (
            <Space directions={'h'} size={'lg'} />
        )

    }, [selectedTheme]);

    const Separator = useCallback(() => {
        return <View style={{ height: 13.8 }} />;
    }, []);


    const keyExtractor = useCallback((item, index) => item.id || item, []);

    return (
        <View style={style.container}>
            <MidViewModal.Modal enableOnBackDrop={true}
                                contentStyle={style.previewModal}
                                animationIn={'slideInDown'}
                                animationOut={'slideOutDown'}
                                animationInTiming={250}
                                animationOutTiming={250}
                                style={LayoutStyle.AlignItemsCenter}>
                <ImageWithBlur style={style.previewImage}
                               useFastImage={true}
                               imageUrl={refactorImageUrl(previewImage, 0)}
                               thumbnailUrl={refactorImageUrl(previewImage, 1)} />
            </MidViewModal.Modal>
            <FlatList
                data={withThemes? allThemes: allAvatars}
                numColumns={2}
                renderItem={renderItem}
                columnWrapperStyle={style.listColumnWrapper}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={ListFooterComponent}
                contentContainerStyle={style.contentContainerStyle}
                ItemSeparatorComponent={Separator}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

export default CustomizeProfile;
