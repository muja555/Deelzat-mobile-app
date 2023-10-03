import React from 'react';
import {View, Text, StatusBar, SafeAreaView, TouchableOpacity} from 'react-native';

import {blackHeaderStyle} from "modules/main/components/black-header/black-header.component.style";
import CloseSvg from "assets/icons/Close.svg";
import RotateSvg from "assets/icons/Rotate.svg";
import {Colors} from "deelzat/style";
import I19n from 'dz-I19n';
import {DzText} from "deelzat/v2-ui";

const ImageCropHeader = (props) => {

    const {
        onCancel = () => {},
        onRotate = () => {},
        onDone = () => {},
    } = props;

    return (
        <SafeAreaView style={{backgroundColor: 'black'}}>
            <View style={blackHeaderStyle.header}>
                <View style={blackHeaderStyle.btnWrapper}>
                    <TouchableOpacity
                        style={blackHeaderStyle.btn}
                        onPress={onCancel}
                    >
                        <CloseSvg
                            style={{marginStart: 10, color: 'green'}}
                            fill={'#fff'}
                            width={30}
                            height={30}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>

                </View>
                <View style={blackHeaderStyle.btnWrapper}>
                    <TouchableOpacity
                        style={blackHeaderStyle.btn}
                        onPress={onRotate}
                    >
                        <RotateSvg
                            style={{marginEnd: 10, color: Colors.LIGHT_GREY}}
                            stroke={'#fff'}
                            width={24}
                            height={24}
                        />
                    </TouchableOpacity>
                </View>
                <View style={blackHeaderStyle.btnWrapper}>
                    <TouchableOpacity
                        style={blackHeaderStyle.btnHero}
                        onPress={onDone}
                    >
                        <DzText style={blackHeaderStyle.btnText}>
                            {I19n.t('تم')}
                        </DzText>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ImageCropHeader;
