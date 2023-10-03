import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {
    blackHeaderStyle
} from "modules/main/components/black-header/black-header.component.style";
import CloseSvg from "assets/icons/Close.svg";
import I19n from 'dz-I19n';
import {DzText} from "deelzat/v2-ui";

const ProductImagesEditHeader = (props) => {

    const {
        title = '',
        onCancel = () => {},
        onNext = () => {},
        canMoveNext = false,
        buttonTitle = I19n.t('التالي')
    } = props;

    return (
        <View style={blackHeaderStyle.header}>
            <View style={blackHeaderStyle.btnWrapper}>
                <TouchableOpacity
                    style={blackHeaderStyle.btn}
                    onPress={onCancel}
                >
                    <CloseSvg
                        style={{marginStart: 10, color: 'green'}}
                        stroke={'#fff'}
                        width={20}
                        height={20}
                    />
                </TouchableOpacity>
            </View>
            <View style={blackHeaderStyle.titleWrapper}>
                <DzText style={blackHeaderStyle.title}> {title}  </DzText>
            </View>
            <View style={blackHeaderStyle.btnWrapper}>
                {
                    !!canMoveNext &&
                    <TouchableOpacity
                        style={blackHeaderStyle.btnHero}
                        onPress={onNext}
                    >
                        <DzText style={blackHeaderStyle.btnText}>
                            {buttonTitle}
                        </DzText>
                    </TouchableOpacity>
                }

            </View>
        </View>
    );
};

export default ProductImagesEditHeader;
