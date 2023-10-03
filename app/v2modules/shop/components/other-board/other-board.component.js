import React from 'react';
import {View, Text} from 'react-native';
import PlanetIcon from "assets/icons/Planet.svg";
import ComingSoonEn from "assets/icons/ComingSoonEN.svg";
import I19n, {getLocale, isRTL} from 'dz-I19n';

import {otherBoardStyle as style} from './other-board.component.style';
import {DzText} from "deelzat/v2-ui";

const OtherBoard = () => {

    return (
        <View style={style.container}>
            <View style={style.inner}>
                <DzText style={style.comingSoon}>
                    {
                        (isRTL()) &&
                        <>
                            {I19n.t('قريباً').replace(' ', '\n')}
                        </>
                    }
                    {
                        (getLocale() === 'en') &&
                        <ComingSoonEn/>
                    }
                </DzText>
                <View style={style.planetStyle}>
                    <PlanetIcon/>
                </View>
            </View>
        </View>
    );
};

export default OtherBoard;
