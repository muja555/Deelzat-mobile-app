import React, {useEffect, useRef, useState} from 'react';
import {View, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, BackHandler} from 'react-native';

import { searchContainerStyle as style } from './search.container.style';
import {ButtonOptions, Space} from "deelzat/ui";
import BackSvg from "assets/icons/BackIcon.svg";
import {Colors} from "deelzat/style";
import IconButton from "deelzat/v2-ui/icon-button";
import SearchIcon from 'assets/icons/NewSearch.svg';
import {useIsFocused} from "@react-navigation/native";
import SearchApi from "modules/search/apis/saerch.api";
import SearchResults from "v2modules/search/components/search-results/search-results.component";
import {getRecentSearch, saveRecentSearch} from "v2modules/search/others/search.localstore";
import RecentSearch from "v2modules/search/components/recent-search/recent-search.component";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import {routeToProducts, routeToShop} from "modules/root/components/deeplinks-router/deeplinks-router.utils";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import {Touchable} from "deelzat/v2-ui";
import CloseIcon from "assets/icons/Close.svg";
import {LocalizedLayout} from "deelzat/style";
import {trackClickOnSearchViewAll} from "modules/analytics/others/analytics.utils";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import AlgoliaIndicesConst from 'modules/main/constants/algolia-indices.const';


const MAX_RECENT_ITEMS = 10;
let searchTaskId;
const SearchContainer = () => {

    const textInputRef = useRef();
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();

    const [showResults, showResultsSet] = useState(false);
    const [isLoading, isLoadingSet] = useState(false);
    const [results, resultsSet] = useState({});
    const [searchText, searchTextSet] = useState('');
    const [recentSearch, recentSearchSet] = useState([]);

    const onPressBack = () => {
        RootNavigation.goBack();
    }

    const trackSource = {name: EVENT_SOURCE.SEARCH, attr1: searchText};
    const onResultPress = (item) => {

        if (item.price != undefined) {
           RootNavigation.push(MainStackNavsConst.PRODUCT_DETAILS, {skeleton: item, trackSource});
        } else {
            routeToShop(item, null, trackSource);
        }

        addToRecent(item.name || item.title);
    }

    useEffect(() => {

        textInputRef.current.focus();

        getRecentSearch()
            .then(recentSearchSet)
            .catch(console.warn);

    }, []);

    const addToRecent = (addedText) => {
        recentSearchSet(oldArr => {
            const toAddText = addedText || searchText;
            let _recents = oldArr;
            if (!oldArr.length || oldArr.length > 0 && oldArr[0] !== toAddText) {
                _recents = [toAddText, ...oldArr];
            }

            if (oldArr.length >= MAX_RECENT_ITEMS) {
                return _recents.slice(0, MAX_RECENT_ITEMS - 1)
            }
            return _recents;
        })
    }


    useEffect(() => {
        saveRecentSearch(recentSearch);
    }, [recentSearch])


    useEffect(() => {

        const onKeyboardBackPressed = () => {
            if (!isFocused) {
                return false;
            }
            else if (searchText) {
                searchTextSet('');
            }
            else {
                onPressBack()
            }
            return true;
        }

        BackHandler.addEventListener('hardwareBackPress', onKeyboardBackPressed);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onKeyboardBackPressed);
        }
    }, [isFocused, searchText]);


    useEffect(() => {

        if (!isFocused)
            return;

        if (searchText) {
            isLoadingSet(true);
            searchTaskId = setTimeout(async () => {
                const res = await SearchApi.search(searchText).catch(console.warn);
                if (searchTaskId !== 0) { // hasn't been cancelled

                    // trim results max to 10
                    if (res[AlgoliaIndicesConst.SHOPS].length > 10) {
                        res[AlgoliaIndicesConst.SHOPS] = res[AlgoliaIndicesConst.SHOPS].slice(0, 10);
                    }
                    if (res[AlgoliaIndicesConst.PRODUCTS].length > 10) {
                        res[AlgoliaIndicesConst.PRODUCTS] = res[AlgoliaIndicesConst.PRODUCTS].slice(0, 10);
                    }
                    resultsSet(res);
                    isLoadingSet(false);
                }
            }, 350);
        }
        showResultsSet(!!searchText);

        return () => {
            clearTimeout(searchTaskId);
        }
    }, [searchText]);


    const onSubmitEditing = () => {
        if (searchText){
            addToRecent();
        }
    }


    const onModifyRecentList = (newList, newText) => {
        searchTextSet(newText);
        recentSearchSet(newList);
    }


    const onPressShowMore = () => {
        trackClickOnSearchViewAll(searchText);
        routeToProducts({id: [[{attribute: "text", operator: ":", value: searchText}]]}, trackSource);
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'none'}
                              style={[style.container, {paddingTop: insets.top}]}>
            <Space directions={'h'} size={'md'}/>
            <View style={style.header}>
                <IconButton onPress={onPressBack} btnStyle={[style.backButton, LocalizedLayout.ScaleX()]} type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BackSvg stroke={Colors.N_BLACK} width={24} height={24}/>
                </IconButton>
                <Space directions={'v'}/>
                <View style={style.inputView}>
                    <SearchIcon width={24} height={24} fill={'white'}/>
                    <Space directions={'v'} size={'sm'}/>
                    <TextInput ref={textInputRef}
                               style={[style.inputText, LocalizedLayout.TextAlign()]}
                               autoFocus={true}
                               value={searchText}
                               onSubmitEditing={onSubmitEditing}
                               onChangeText={searchTextSet}/>
                    {
                        (showResults) &&
                        <Touchable style={style.clearTextButton}
                                    onPress={() => searchTextSet('')}>
                            <CloseIcon stroke={Colors.N_BLACK} width={12} height={12}/>
                        </Touchable>
                    }
                </View>
            </View>
            <Space directions={'h'}/>
            <Space directions={'h'} size={'md'}/>
            {
                (showResults) &&
                <SearchResults results={results}
                               onItemPress={onResultPress}
                               onPressShowMore={onPressShowMore}
                               isLoading={isLoading}/>
            }
            {
                (!showResults) &&
                <RecentSearch recentSearch={recentSearch}
                              onModifyRecentList={onModifyRecentList}/>
            }
        </KeyboardAvoidingView>
    );
};

export default SearchContainer;
