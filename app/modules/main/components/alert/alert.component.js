import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import AlertService from "modules/main/others/alert.service";
import AlertModeConst from "modules/main/constants/alert-mode.const";

import {alertStyle as style} from './alert.component.style';
import {Button, ButtonOptions, Space} from "deelzat/ui";
import {DzText} from "deelzat/v2-ui";
import I19n from "dz-I19n";

const Alert = (props) => {

    const {
        type = '',
        title = '',
        message = '',
        onHide = () => {}
    } = props;

    const [mode, modeSet] = useState(AlertService.Modes[AlertModeConst.SUCCESS]);

    useEffect(() =>  {
        modeSet(AlertService.Modes[type] || AlertService.Modes[AlertModeConst.SUCCESS])
    }, [type]);


    return (
        <View style={[style.container, mode.bgStyle]}>

            {<mode.icon/>}
            <Space size={'lg'} directions={'h'}/>
            <DzText style={style.title}>
                {title}
            </DzText>
            <Space size={'md'} directions={'h'}/>
            <DzText style={style.message}>
                {message}
            </DzText>
            <Space size={'lg'} directions={'h'}/>
            <Space size={'md'} directions={'h'}/>
            <View style={style.btn}>
                <Button
                    btnStyle={mode.btnStyle}
                    textStyle={mode.btnTextStyle}
                    onPress={onHide}
                    size={ButtonOptions.Size.LG}
                    type={ButtonOptions.Type.PRIMARY_OUTLINE}
                    text={I19n.t('إغلاق')}
                />
            </View>

        </View>
    );
};

export default Alert;
