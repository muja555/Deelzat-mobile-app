import React, {useCallback} from 'react';
import {chatImagesListStyle as style} from "./chat-images-list.component.style";
import {FlatList, Image, TouchableOpacity, View} from "react-native";
import RemoveIcon from 'assets/icons/Remove.svg'
import {Colors} from "deelzat/style";
import DeleteSvg from 'assets/icons/Delete.svg';
import * as Progress from 'react-native-progress';

const ChatImagesListItem = (props) => {

    const {
        image = {},
        onClick = () => {}
    } = props;

    return (
        <View key={image.id}>
            <View style={style.imageWrapper}>
                <Image style={style.image}
                       source={{uri: image.uri}}/>
                {
                    (image.status === 'uploading' && !!image.progress) &&
                    <View style={style.progressCircle}>
                        <Progress.Pie size={46}
                                         indeterminate={false}
                                         fill={Colors.MAIN_COLOR}
                                         color={Colors.MAIN_COLOR}
                                         duration={500}
                                         progress={image.progress}/>
                    </View>
                }
                {
                    image.status === 'error' &&
                    <View style={style.errorIcon}>
                        <DeleteSvg fill={Colors.ORANGE_PINK} stroke={2} strokeColor={'#fff'} height={25} width={25} />
                    </View>
                }
                <TouchableOpacity style={style.deleteIcon}
                                  hitSlop={{top: 10,bottom: 10, left: 5, right: 5}}
                                  onPress={() => { onClick(image) }}>
                    <RemoveIcon strokeWidth={4} fill={Colors.MAIN_COLOR} width={20} height={20} />
                </TouchableOpacity>
            </View>
        </View>
    );
}


const ChatImagesList = (props) => {

    const {
        images = [],
        onItemPress = (image) => {},
    } = props;

    const renderItem = useCallback(({item, index}) => {
        return (
            <ChatImagesListItem image={item} onClick={onItemPress} />
        )
    }, []);

    const keyExtractor = useCallback((item, index) => '' + index, []);

    return (
        <View style={style.container}>
            <FlatList
                horizontal={true}
                contentContainerStyle={style.list}
                data={images}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
            />
        </View>
    );
}

export default ChatImagesList
