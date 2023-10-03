import React, {useMemo, useState} from 'react';

import { chatBubbleImagesItemStyle as style } from './chat-bubble-images-item.component.style';
import {refactorImageUrl} from "modules/main/others/main-utils";
import { ImageWithBlur, Touchable } from 'deelzat/v2-ui';

const ChatBubbleImagesItem = (props) => {
    const {
        image,
        onPress = () => {}
    } = props;

    return (
        <Touchable onPress={onPress} style={style.container}>
            <ImageWithBlur
                imageUrl={image}
                thumbnailUrl={refactorImageUrl(image, 1)}
                resizeMode={'cover'}
                style={style.image} />
        </Touchable>
    )
};

export default ChatBubbleImagesItem;
