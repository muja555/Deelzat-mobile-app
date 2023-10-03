import { Dimensions, StyleSheet } from 'react-native';

const style = {
    container: {},
    itemContainerMin: {
        flexDirection: 'row',
        flex: 0.33,
    },
    itemContainer: {
        flex: 0.48,
    },
    itemViewMin: {
        width: '0.95%'
    },
    itemView: {
        width: '100%'
    },
    listColumnWrapper: {
        justifyContent: 'space-between',
    },
    listContents: {
        paddingTop: 20,
        paddingBottom: 40,
    },
};

const productListStyle = StyleSheet.create(style);
export { productListStyle as productListStyle };
