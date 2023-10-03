import React from 'react';
import {StackActions} from "@react-navigation/native";

export const navigationRef = React.createRef();



export function navigate(name, params) {
    navigationRef.current?.navigate(name, params);
}


export function push(name, params) {
    navigationRef.current?.dispatch(StackActions.push(name, params));
}


export function goBack(number = 1) {
    navigationRef.current?.dispatch(StackActions.pop(number));
}

export function popToTop() {
    navigationRef.current?.dispatch(StackActions.popToTop());
}

