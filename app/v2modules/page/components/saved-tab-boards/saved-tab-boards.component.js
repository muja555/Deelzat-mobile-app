import React from 'react';
import { View, Text } from 'react-native';

import { savedTabBoardsStyle as style } from './saved-tab-boards.component.style';
import FastImage from "@deelzat/react-native-fast-image";
import StayTunedEN from "assets/icons/StayTunedEN.svg";
import I19n, {isRTL} from 'dz-I19n';
import {DzText} from "deelzat/v2-ui";
let AstronautGif;

const SavedTabBoards = () => {

    if (!AstronautGif) {
        AstronautGif = require('assets/icons/Astronaut.gif');
    }
    return (
        <View style={style.container}>
            <FastImage
                style={style.gif}
                resizeMode={FastImage.resizeMode.cover}
                source={AstronautGif}/>
            <View style={style.textsView}>
                <DzText style={style.text}>
                    {I19n.t('من مركبة ديلزات')}
                    {"\n"}
                    {I19n.t('زميلنا عائد لكم بميزات وتجارب جديدة')}
                    {"\n"}{"\n"}
                    {I19n.t('تمنوا له رحلة موفقة')}
                </DzText>
                {
                    (isRTL()) &&
                        <DzText style={style.stayTuned}>
                            {I19n.t('ابقوا على إطلاع')}
                        </DzText>
                }
                {
                    (!isRTL()) &&
                    <StayTunedEN />
                }
            </View>
        </View>
    );
};

export default SavedTabBoards;
