import React, {useEffect} from 'react';
import {Platform, AppState} from 'react-native';
import FastImage from "@deelzat/react-native-fast-image";
import DeviceInfo from "react-native-device-info";

const LOG_MEMORY = false;
let LAST_CLEAR_TIME = 0;
const MemoryWatcher = () => {

    // useEffect(() => {
    //
    //     const interval = setInterval(async () => {
    //
    //         if (Platform.OS === 'android') {
    //             const usedMemory = await DeviceInfo.getUsedMemory();
    //             const maxMemory = await DeviceInfo.getMaxMemory() || 1;
    //
    //             const usagePercentage = (usedMemory / maxMemory)
    //             const isLowMemory = usagePercentage > 0.80 && usagePercentage < 1;
    //
    //             const currentTime = Date.now();
    //             if (isLowMemory
    //                 && (LAST_CLEAR_TIME === 0 || currentTime - LAST_CLEAR_TIME > (8 * 1000))) {
    //                 LAST_CLEAR_TIME = currentTime;
    //                 FastImage.clearMemoryCache();
    //             }
    //
    //
    //             if (LOG_MEMORY) {
    //                 console.log('======= memory inspection =======')
    //                 console.log('==== used memory: ' +  Math.round(usedMemory/(1024*1024)))
    //                 console.log('==== max memory: ' +  Math.round(maxMemory/(1024*1024)))
    //                 console.log('==== percentage: ' + (usedMemory/maxMemory))
    //                 console.log('==== is_low: ' + isLowMemory)
    //             }
    //         }
    //
    //     }, 5000);
    //
    //
    //     const memoryListener = AppState.addEventListener('memoryWarning', (e) => {
    //         console.log('memory warning.. clearing cache');
    //         FastImage.clearMemoryCache();
    //     });
    //
    //     return () => {
    //         memoryListener?.remove();
    //         clearInterval(interval);
    //     }
    // }, [])

    return <></>
};

export default MemoryWatcher;
