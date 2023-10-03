import {isRTL} from "dz-I19n";

const LocalizedLayout = {};

LocalizedLayout.ScaleX = (revert) => {
    let rtl = isRTL();
    if (revert) {
        rtl = !rtl;
    }
    return {
        transform: [{scaleX: rtl? -1 : 1}],
    }
}

LocalizedLayout.TextAlign = (revert) => {
    let rtl = isRTL();
    if (revert) {
        rtl = !rtl;
    }
    return {
        textAlign: rtl? 'right': 'left',
    }
}


LocalizedLayout.TextAlignRe = () => {
    let rtl = isRTL();
    if (isRTL()) {
        rtl = !rtl;
    }
    return {
        textAlign: rtl? 'right': 'left',
    }
}


LocalizedLayout.value = (valueRTL, valueLTR) => {
    return isRTL()? valueRTL: valueLTR;
}

export {LocalizedLayout as LocalizedLayout}
