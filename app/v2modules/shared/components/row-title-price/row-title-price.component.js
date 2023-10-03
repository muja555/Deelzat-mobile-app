import React from 'react';
import { View } from 'react-native';

import { rowTitlePriceStyle as style } from './row-title-price.component.style';
import {DzText} from "deelzat/v2-ui";
import { formatPrice } from 'v2modules/checkout/others/checkout.utils';

const RowTitlePrice = (props) => {
    const {
        title,
        value,
        currencyCode = '',
    } = props;

    return (
        <View key={title} style={style.rowView}>
            <DzText style={style.rowTitle}>
                {title}
            </DzText>
            <DzText style={style.rowValue}>
                {formatPrice(value, currencyCode)}
            </DzText>
        </View>
    )
};

export default RowTitlePrice;
