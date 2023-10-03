import React, { useEffect, useRef, useState } from 'react';
import {inboxContainerStyle as style} from "./inbox.container.style";
import {chatSelectors} from "modules/chat/stores/chat/chat.store";
import {useSelector} from "react-redux";
import {SafeAreaView, View, Animated, ActivityIndicator} from "react-native";
import SearchBar from "modules/search/components/search-bar/search-bar.component";
import InboxRoutesConst from "modules/chat/constants/inbox-routes.const";
import ConversationsList from "modules/chat/components/conversations-list/conversations-list.component";
import {Colors, LayoutStyle, LocalizedLayout, Spacing} from "deelzat/style";
import I19n from 'dz-I19n';
import {ButtonOptions, Space} from "deelzat/ui";
import IconButton from "deelzat/v2-ui/icon-button";
import BackSvg from "assets/icons/BackIcon.svg";
import {DzText} from "deelzat/v2-ui";

import InboxTabBar from "v2modules/page/components/inbox-tab-bar/inbox-tab-bar.component";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import SupportConversationListModeConst from 'modules/chat/constants/support-conversation-list-mode.const';
import PagerView from '@deelzat/react-native-pager-view';

const TopHeader = () => {
    return (
        <View style={Spacing.HorizontalPadding}>
            <Space directions={'h'} size={'md'} />
            <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter]}>
                <IconButton onPress={RootNavigation.goBack} btnStyle={[style.backButton, LocalizedLayout.ScaleX()]} type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BackSvg stroke={Colors.N_BLACK} width={24} height={24}/>
                </IconButton>
                <DzText style={style.headerTitle}>
                    {I19n.t('المحادثات')}
                </DzText>
                <View style={style.endPlaceholder}/>
            </View>
        </View>
    )
}

const TABS = [InboxRoutesConst.MESSAGES, InboxRoutesConst.STARRED_MESSAGES, InboxRoutesConst.SEARCH];
const InboxSearchBar = ({onChangeText}) => <SearchBar
    containerStyle={style.searchContainer}
    inputTextStyle={style.searchInput}
    onChangeText={onChangeText}
    placeholderText={I19n.t('بحث عن محادثة')}/>;

const InboxContainer = () => {

    const [currentTab, currentTabSet] = useState(InboxRoutesConst.MESSAGES);

    const tabsPagerRef = useRef();
    const chatProfile = useSelector(chatSelectors.chatProfileSelector);

    const [showLoader, showLoaderSet] = useState(true)
    const loaderFadeAnim = useRef(new Animated.Value(1)).current;
    const [searchText, searchTextSet] = useState();

    const [isLoading, isLoadingSet] = useState(true);


    useEffect(() => {
        setTimeout(() => isLoadingSet(false), 500)
    }, []);


    useEffect(() => {
        if (isLoading)
            Animated.timing(loaderFadeAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true
            }).start(() => {
                showLoaderSet(false)
            })
    }, [isLoading]);

    const onChangeText = (_searchText) => {-
        searchTextSet(_searchText);
    }


    const onPressTab = (_currentTab) => {
        currentTabSet(_currentTab);
        tabsPagerRef.current.setPage(TABS.indexOf(_currentTab));
    }

    useEffect(() => {
        if (!searchText) {
            currentTabSet(InboxRoutesConst.MESSAGES);
            tabsPagerRef.current.setPageWithoutAnimation(TABS.indexOf(InboxRoutesConst.MESSAGES));
        }
        else {
            currentTabSet(InboxRoutesConst.SEARCH);
            tabsPagerRef.current.setPageWithoutAnimation(TABS.indexOf(InboxRoutesConst.SEARCH));
        }
    }, [searchText]);


    return (
        <SafeAreaView style={style.container}>
            <TopHeader />
            <Space directions={'h'} size={'md'} />
            <InboxSearchBar onChangeText={onChangeText}/>
            {
                (!searchText) &&
                <InboxTabBar currentTab={currentTab} onPressTab={onPressTab}/>
            }
            <PagerView style={LayoutStyle.Flex}
                       scrollEnabled={false}
                       ref={tabsPagerRef}
                       collapsable={false}
                       initialPage={0}>

                <View style={LayoutStyle.Flex} key={InboxRoutesConst.MESSAGES}>
                    <ConversationsList chatProfile={chatProfile}
                                       supportConversationMode={SupportConversationListModeConst.VISIBLE_STICKY} />
                </View>
                <View style={LayoutStyle.Flex} key={InboxRoutesConst.STARRED_MESSAGES}>
                    <ConversationsList chatProfile={chatProfile}
                                       supportConversationMode={SupportConversationListModeConst.HIDDEN}
                                       isStarredList={true}
                                       emptyItemsText={I19n.t('لا توجد محادثات مفضلة')} />
                </View>
                <View style={LayoutStyle.Flex}  key={InboxRoutesConst.SEARCH}>
                    <ConversationsList chatProfile={chatProfile}
                                       supportConversationMode={SupportConversationListModeConst.VISIBLE_IN_LIST}
                                       searchText={searchText}
                                       emptyItemsText={I19n.t('لا توجد محادثات مطابقة لنتائج البحث')} />
                </View>
            </PagerView>
            {
                showLoader &&
                <Animated.View style={[style.loader, {opacity: loaderFadeAnim}]}>
                    <ActivityIndicator size="small" color={Colors.MAIN_COLOR}/>
                </Animated.View>
            }
        </SafeAreaView>
    )
}

export default InboxContainer;
