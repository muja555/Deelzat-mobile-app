const Colors = {};

Colors.alpha = (hexCode: string, opacity: number) => {
    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity})`;
}


Colors.invert = (hexCode) => {
    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    return '#' + (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
}

Colors.MAIN_COLOR = '#00a698';
Colors.DARK_MAIN_COLOR = '#00655c';
Colors.ERROR_COLOR = '#f03000';
Colors.ERROR_COLOR_2 = '#DB0000';
Colors.LIGHT_BLUE = '#caebe9';
Colors.BLACK = '#222222';
Colors.BLUEBERRY = '#503f90';
Colors.CERULEAN_BLUE = '#0a70e3';
Colors.LIGHT_ORANGE_2 = '#ffac44';
Colors.LIGHT_GREY = '#f2f2f2';
Colors.ORANGE_PINK = '#ff6f4f';
Colors.GREY = '#c7c7cc';
Colors.DARK_GREY = '#6d6d6d';
Colors.DARKER_GREY = '#555555';
Colors.ACCENT_BLUE = '#007aff';
Colors.ACCENT_BLUE_100 = 'rgba(10,112,227,0.1)';
Colors.BROWN_GREY = '#888888';
Colors.MEDIUM_GREY = '#D0D0D0';
Colors.BROWN_GREY_TWENTY_TRANSPARENT = 'rgba(136,136,136,0.2)';
Colors.TEXT_GREY = '#999';
Colors.BORDER_GREY = '#d0d0d0';
Colors.SOMEHOW_WHITE = '#EAEAEA';
Colors.KINDA_WHITE = '#FFF6EC';
Colors.SUPER_GREEN = '#49FF71';
Colors.SUPER_GREEN_20 = 'rgba(0,166,152,0.2)';
Colors.EGG_COLOR = 'rgba(255,232,202,0.5)'
Colors.YELLOW = '#FBBC05'
Colors.YELLOW_2 ='#FFFACD'

Colors.ORANGE_100 = '#fff6ed';
Colors.ORANGE_300 = '#ffe2dc';

Colors.BROWN_100 = '#e7dfd7';


Colors.N_GREY = '#F4F4F4';
Colors.N_GREY_2 = '#989797';
Colors.N_GREY_3 = 'rgba(0, 0, 0, 0.1)';
Colors.N_GREY_4 = '#F1F1F1';
Colors.N_GREY_5 = '#C4C4C4';
Colors.N_BLACK = '#393939';
Colors.N_BLACK_DARK = '#0F0F0F'
Colors.N_BLACK_50 = Colors.alpha(Colors.N_BLACK, 0.5);
Colors.MAIN_COLOR_70 = '#4cc1b7';
Colors.MAIN_COLOR_30 = 'rgba(0, 166, 152, 0.3)';
Colors.ORANGE_PINK_60 = 'rgba(255, 111, 79, 0.6)';
Colors.MAIN_COLOR_60 = 'rgba(0, 166, 152, 0.6)';
Colors.LIGHT_MAIN_60 = 'rgba(196, 220, 110, 0.6)';
Colors.BLACK_RED = '#DF5555';
Colors.LIGHT_ORANGE = '#FF7B59';
Colors.CERULEAN_BLUE_2 = '#008ECB';
Colors.CERULEAN_BLUE_3 = '#09B2E3';
Colors.DARK_LEMOM = '#C4DC6E66';
Colors.LINK = '#0645AD';
Colors.LINK_2 = '#027DE5'
Colors.RED_2 = '#FF5959';
Colors.SPLASH = '#fdfdfe'

Colors.Gray000 = '#FAFAFA';
Colors.Gray100 = '#F5F5F5';
Colors.Gray150 = '#F8F8F8';
Colors.Gray200 = '#EEEEEE';
Colors.Gray300 = '#E0E0E0';
Colors.Gray400 = '#BDBDBD';
Colors.Gray500 = '#9E9E9E';
Colors.Gray600 = '#757575';
Colors.Gray700 = '#616161';
Colors.Gray800 = '#424242';
Colors.Gray900 = '#424242';

Object.freeze(Colors);

export default Colors;
