import React, {useCallback, useState} from 'react';
import {View, Text, FlatList} from 'react-native';

import { chatBubbleImagesStyle as style } from './chat-bubble-images.component.style';
import ChatBubbleImagesItem from "modules/chat/components/chat-bubble-images-item/chat-bubble-images-item.component";
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

const ChatBubbleImages = (props) => {
    const {
        images,
    } = props;


    const renderItem = useCallback(({item, index}) => {

        const onPress = () => {
            RootNavigation.push(MainStackNavsConst.IMAGE_GALLERY, {
                images: images?.map(image => image.src || image) || [],
                currentIndex: index
            });
        }

        return (
            <ChatBubbleImagesItem
                image={item}
                onPress={onPress} />
        )

    }, []);

    return (
        <View style={style.multiImagesContainer}>
            <FlatList numColumns={2}
                      contentContainerStyle={style.multiImagesListContainer}
                      data={images}
                      columnWrapperStyle={style.multiImagesColWrapper}
                      showsVerticalScrollIndicator={false}
                      renderItem={renderItem}
                      keyExtractor={item => item}/>
        </View>
    )
}
export default ChatBubbleImages;
