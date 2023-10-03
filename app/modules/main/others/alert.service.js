import React from "react";
import EventEmitter from 'eventemitter3';
import AlertModeConst from "modules/main/constants/alert-mode.const";
import DoneOutlineSvg from 'assets/icons/DoneOutline.svg';
import DeleteSvg from 'assets/icons/Delete.svg';
import {Colors} from "deelzat/style";
import {View} from "react-native";

const eventEmitter = new EventEmitter();
const AlertService = {};

// Events
AlertService.Events = {
    SET_VISIBLE: 'SET_VISIBLE'
};

AlertService.Modes = {

    [AlertModeConst.SUCCESS] : {
        value: AlertModeConst.SUCCESS,
        icon: () => <DoneOutlineSvg fill={Colors.MAIN_COLOR} height={40} width={40} />,
        bgStyle: {
            backgroundColor: Colors.ORANGE_100,
        },
        btnStyle: {
            borderColor: Colors.BROWN_100,
            backgroundColor: Colors.BROWN_100
        },
        btnTextStyle: {
            color: '#000'
        }
    },

    [AlertModeConst.FAIL] : {
        value: AlertModeConst.FAIL,
        icon: () =>
            <View style={{width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.ORANGE_100, alignItems: 'center', justifyContent: 'center' }}>
            <DeleteSvg fill={Colors.ORANGE_PINK} height={20} width={20} />
        </View>,
        bgStyle: {
            backgroundColor: '#fff',
        },
        btnStyle: {
            borderColor: Colors.BROWN_100,
            backgroundColor: Colors.BROWN_100
        },
        btnTextStyle: {
            color: '#000'
        }
    }
};

const setVisible = (payload) => {
    eventEmitter.emit(AlertService.Events.SET_VISIBLE, payload);
};

AlertService.Success = (title = '', message = '') => {
    setVisible({
        show: true,
        type: AlertModeConst.SUCCESS,
        title: title,
        message: message
    });
};

AlertService.Danger = (title = '', message = '') => {
    setVisible({
        show: true,
        type: AlertModeConst.FAIL,
        title: title,
        message: message
    });
};


AlertService.onSetVisible = (callback) => {

    eventEmitter.on(AlertService.Events.SET_VISIBLE, callback);

    return () => {
        eventEmitter.off(AlertService.Events.SET_VISIBLE, callback);
    }
};

Object.freeze(AlertService);
export default AlertService;
