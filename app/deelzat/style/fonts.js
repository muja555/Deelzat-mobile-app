import {Platform} from "react-native";

const Font = {};

Font.Bold = {
    fontFamily: 'AvenirArabic-Heavy',
};

Font.Regular = {
    fontFamily: 'AvenirArabic-Book'
};



if (Platform.OS === 'ios') {

    Font.Bold = {
        fontFamily: 'Avenir Arabic',
        fontWeight: 'bold',
    };

    Font.Regular = {
        fontFamily: 'Avenir Arabic',
        fontWeight: '400',
    };

}


export default Font;
