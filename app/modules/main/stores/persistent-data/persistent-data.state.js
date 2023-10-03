
function PersistentDataState() {
    return {
        loading: false,
        loaded: false,
        addonsList: [],
        citiesList: [],
        countriesList: [],
        categories: [],
        subCategories: {},
        fields: {},
        staticContent: {},
        shippableCountries: [],
    }
}

const persistentDataState = new PersistentDataState();
export default persistentDataState;
