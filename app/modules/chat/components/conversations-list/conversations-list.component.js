import React, { useCallback, useEffect, useRef, useState } from 'react';
import {conversationsListStyle as style} from './conversations-list.component.style'
import ConversationsListItem from "modules/chat/components/conversations-list-item/conversations-list-item.component";
import {SwipeListView} from 'react-native-swipe-list-view';
import ConversationsListItemAction from "modules/chat/components/conversations-list-item-actions/conversations-list-item-actions.component";
import { ActivityIndicator, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ConversationActionsConst from "modules/chat/constants/conversation-actions.const";
import {EmptyConversations} from "modules/chat/components/empty-conversations/empty-conversations.component";
import {chatSelectors, chatThunks} from "modules/chat/stores/chat/chat.store";
import {useDispatch, useSelector} from "react-redux";
import ConversationSupportItem from "modules/chat/components/conversation-support-item/conversation-support-item.component";
import I19n, {isRTL} from 'dz-I19n';
import SupportConversationListModeConst from 'modules/chat/constants/support-conversation-list-mode.const';
import { routeToChatRoom } from 'modules/root/components/deeplinks-router/deeplinks-router.utils';
import EVENT_SOURCE from 'modules/analytics/constants/analytics-event-source.const';
import {
    getRoomName,
} from 'modules/chat/others/chat.utils';
import ConversationsListService from 'modules/chat/components/conversations-list/conversations-list.component.service';
import { Space } from 'deelzat/ui';
import { Colors } from 'deelzat/style';

const ConversationsList = (props) => {

    const {
        chatProfile,
        isStarredList,
        searchText,
        supportConversationMode,
        emptyItemsText = I19n.t('لايوجد محادثات مع أحد.') + '\n' +  I19n.t('عند التواصل مع الآخرين ستظهر المحادثات هنا'),
    } = props;

    const dispatch = useDispatch();
    const listRef = useRef()
    const itemsRef = useRef({});

    const conversationsQuery = useRef();
    const latestDoctRef = useRef();

    const PAGE_SIZE = searchText? 50: 10;
    const supportAccount = useSelector(chatSelectors.supportAccountSelector);

    const [fetchMore, fetchMoreSet] = useState(true);
    const [refreshListKey, refreshListKeySet] = useState('3');
    const [currentPage, currentPageSet] = useState(1);
    const [conversations, conversationsSet] = useState([]);
    const [searchResults, searchResultsSet] = useState([]);
    const [stickySupportConversation, stickySupportConversationSet] = useState();


    const injectSupportAccount = (_conversations = []) => {
        if (chatProfile.isSupportAccount)
            return _conversations;

        if (supportConversationMode === SupportConversationListModeConst.VISIBLE_STICKY) {

            if (!stickySupportConversation) {
                let _supportConv = _conversations.find(conv => conv.isWithSupport) || {}
                _supportConv = {..._supportConv, otherUser: supportAccount};
                stickySupportConversationSet(_supportConv);
            }

            return _conversations.filter(conv => !conv.isWithSupport)
        }
        else if (supportConversationMode === SupportConversationListModeConst.HIDDEN) {

            return _conversations.filter(conv => !conv.isWithSupport)
        }
        else {

            return _conversations;
        }
    }


    const updateListChanges = (newLatestConv, remove = false) => {

        if (newLatestConv.isWithSupport && supportConversationMode === SupportConversationListModeConst.VISIBLE_STICKY) {
            stickySupportConversationSet({...newLatestConv, otherUser: supportAccount});
        }
        else {
            const currIndex = conversations.findIndex(conv => conv.roomName === newLatestConv.roomName);
            if (currIndex === -1) {
                conversationsSet(oldConvs => [newLatestConv, ...oldConvs]);
            }
            else {
                const _temp = [...conversations];
                _temp.splice(currIndex, 1);
                if (!remove) {
                    _temp.unshift(newLatestConv);
                }
                conversationsSet(_temp);
            }
        }
    }


    useEffect(() => {
        return ConversationsListService.onRefreshList(() => {
            latestDoctRef.current = undefined;
            refreshListKeySet(Math.random().toString(20).substring(7));
        })
    }, []);


    useEffect(() => {

        if (!chatProfile?.userId) {
            return;
        }

        if (!conversationsQuery.current) {

            conversationsQuery.current =  firestore()
                    .collection(`users/${chatProfile.userId}/chat_rooms`);

            if (isStarredList) {
                conversationsQuery.current = conversationsQuery.current.where("isStarred", "==", true)
            }

            conversationsQuery.current = conversationsQuery.current.orderBy('lastMessageTime', "desc")
                .limit(PAGE_SIZE);
        }

        // fetch chat list
        if (latestDoctRef.current) {
            conversationsQuery.current
                .startAfter(latestDoctRef.current)
                .get()
                .then(docData => {
                    if (docData.docs.length) {
                        latestDoctRef.current = docData.docs[docData.docs.length - 1];
                        conversationsSet(oldConvs => injectSupportAccount([...oldConvs, ...docData.docs?.map(docSnap => docSnap.data())]));
                    }
                    else {
                        fetchMoreSet(false);
                    }
                });
        }
        else {
            conversationsQuery.current
                .get()
                .then(docData => {
                    if (docData.docs.length) {
                        latestDoctRef.current = docData.docs[docData.docs.length - 1];
                        conversationsSet(injectSupportAccount(docData.docs?.map(docSnap => docSnap.data())));
                    }
                });
        }

    }, [refreshListKey, currentPage, chatProfile?.userId]);


    useEffect(() => {

        if (!chatProfile?.userId) {
            return;
        }


        let ignoreUpdate = true;

        const latestConRef = firestore()
            .collection(`users/${chatProfile.userId}/chat_rooms`)
            .orderBy('lastMessageTime', "desc")
            .limit(1);

        return latestConRef.onSnapshot(querySnap => {

            if (ignoreUpdate) {
                ignoreUpdate = false;
                return;
            }

            const changes = querySnap.docChanges();

            if (changes.length > 0) {

                const latestChange = changes[changes.length - 1]
                const latestConv = latestChange.doc.data();

                if (latestChange.type === "added") {
                    updateListChanges(latestConv);
                } else if (latestChange?.type === "modified") {
                    updateListChanges(latestConv);
                } else if (latestChange?.type === "removed") {
                    updateListChanges(latestConv, true);
                }
            }
        });

    }, [conversations]);



    useEffect(() => {

        if (searchText) {
            const _results = [];
            conversations.forEach((conv) => {

                const messageText = (conv.lastMessageText || '').toLowerCase();
                const message = (conv.lastMessage || '').toLowerCase();
                const senderName = (conv.otherUser?.name || '').toLowerCase();

                if (messageText.includes(searchText.toLowerCase())
                    || senderName.includes(searchText.toLowerCase())
                    || message.includes(searchText.toLowerCase())) {
                    _results.push(conv);
                }
            });

            searchResultsSet(_results);
        }

    }, [searchText]);


    const onPressItem = useCallback((chatItem) => {

        const user1 = chatProfile.userId
        const user2 = chatItem.otherUser?.userId
        if (user1 && user2) {

            routeToChatRoom({toUserId: user2}, {name: EVENT_SOURCE.INBOX}, true)
        }
    }, [chatProfile.userId]);



    const onRowOpen = () => {
        dispatch(chatThunks.setShouldNotDisplaySwipeIndicator())
    }


    const onClickAction = (item, action) => {

        listRef.current.closeAllOpenRows();

        const cellRef =itemsRef.current[item.roomName || item.otherUser?.userId];

        if (action === ConversationActionsConst.DELETE) {
            cellRef.displayActionFeedback(ConversationActionsConst.DELETE)
        } else if (action === ConversationActionsConst.ADD_STAR) {
            cellRef.displayActionFeedback(ConversationActionsConst.ADD_STAR)
        } else if (action === ConversationActionsConst.REMOVE_STAR) {
            cellRef.displayActionFeedback(ConversationActionsConst.REMOVE_STAR)
        }
    }


    const renderItem = useCallback(({item, index}) => {
        return (
            <ConversationsListItem
                ref={ref => itemsRef.current[item.roomName || item.otherUser?.userId] = ref}
                chatProfile={chatProfile}
                item={item}
                onPress={() => onPressItem(item)}/>
        )
    }, [chatProfile]);



    const ItemActions = ({item, index}) =>
        <ConversationsListItemAction item={item} onClickAction={onClickAction}/>;


    const keyExtractor = useCallback((item, index) => {

        const user1 = chatProfile.userId;
        const user2 = item.otherUser?.userId;

        return getRoomName(user1, user2);

    }, [chatProfile]);


    const ListHeaderComponent = useCallback(() => {
        return (
            <>
            {
                (stickySupportConversation) &&
                <ConversationSupportItem chatProfile={chatProfile}
                                         item={stickySupportConversation}
                                         containerStyle={style.supportContainer}
                                         onPress={() => onPressItem(stickySupportConversation)}/>
            }
        </>
        )
    }, [chatProfile, stickySupportConversation]);


    const ListSeparator = useCallback(() => {
        return (
            <View style={style.separator} />
        );
    }, []);


    const onEndReached = useCallback(() => {
        if (fetchMore) {
            currentPageSet(old => old + 1);
        }
    }, [fetchMore]);



    const ListFooterComponent = useCallback(() => (
        <View>
            {
                (fetchMore) &&
                <Space directions={'h'} size={['sm', 'md']} />
            }
            <ActivityIndicator style={style.footerLoader}
                               size="small"
                               color={fetchMore? Colors.MAIN_COLOR : 'transparent'} />
            {
                (fetchMore) &&
                <Space directions={'h'} size={['sm', 'md']} />
            }
        </View>
    ), [fetchMore]);


    const EmptyView = () => (
        <>
            {
                stickySupportConversation &&
                <ConversationSupportItem chatProfile={chatProfile}
                                         item={stickySupportConversation}
                                         containerStyle={style.supportContainerEmptyList}
                                         onPress={() => onPressItem(stickySupportConversation)}/>
            }
            <EmptyConversations containerStyle={!!stickySupportConversation? {height: '60%'} : {paddingTop: '30%'}}
                                emptyItemsText={emptyItemsText}/>
        </>
    )


    const isNotSearchText = !searchText;
    const isEmptySearchResuts = !isNotSearchText && searchResults.length === 0;

    return (
        <View style={style.container}>
            {
                (!!conversations && conversations.length > 0) &&
                <SwipeListView ref={listRef}
                               data={searchText? searchResults: conversations}
                               showsVerticalScrollIndicator={false}
                               keyExtractor={keyExtractor}
                               renderItem={renderItem}
                               renderHiddenItem={ItemActions}
                               contentContainerStyle={style.list}
                               tension={20}
                               onEndReached={onEndReached}
                               onRowOpen={onRowOpen}
                               friction={5}
                               ListHeaderComponent={ListHeaderComponent}
                               ListFooterComponent={ListFooterComponent}
                               closeOnScroll={true}
                               disableLeftSwipe={isRTL()}
                               leftOpenValue={isRTL()? 113: 0}
                               disableRightSwipe={false}
                               rightOpenValue={isRTL()? 113: -113}
                               bounces={false}
                               ItemSeparatorComponent={ListSeparator}
                />
            }
            {
                (!conversations || conversations.length === 0 || (isEmptySearchResuts)) &&
                <EmptyView />
            }
        </View>
    )
};

export default ConversationsList;
