import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import {blackHeaderStyle as style} from "./black-header.component.style";
import CloseSvg from "assets/icons/Close.svg";
import {DzText} from "deelzat/v2-ui";

const BlackHeader = (props) => {

    const {
        title = '',
        onDone = () => {},
        onCancel = () => {}
    } = props;

    return (
        <View style={style.header}>
            <View style={style.btnWrapper}>
                <TouchableOpacity
                    style={style.btn}
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
            <View style={style.titleWrapper}>
                <DzText style={style.title}> {title}  </DzText>
            </View>
            <View style={style.btnWrapper}>
                <TouchableOpacity
                    style={style.btnHero}
                    onPress={onDone}
                >
                    <DzText style={style.btnText}>
                        تم
                    </DzText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BlackHeader;
