import React, {useEffect, useState} from 'react';
import FastImage from '@deelzat/react-native-fast-image';
import {Dimensions} from "react-native";
import {refactorImageUrl} from "modules/main/others/main-utils";
const url = require("url");

const DEFAULT_WIDTH = Dimensions.get('window').width / 2;

const ShopImage = (props) => {

    const {
        image = '',
        style = {},
        ...rest
    } = props;

    const [source, sourceSet] = useState();

    // fix facebook profile pics came from auth0
    useEffect(() => {
        const width = !isNaN(style?.width)? style?.width * 2: DEFAULT_WIDTH;
        sourceSet({uri: refactorImageUrl(image, width)});
    }, [image])

    return (
        <FastImage style={style}
                   source={source}
                   {...rest}
        />
    )
}

export default ShopImage;
