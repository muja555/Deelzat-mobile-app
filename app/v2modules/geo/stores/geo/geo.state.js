function GeoStoreState() {
    this.geoCountryCode = undefined;
    this.browseCountryCode = undefined;
    this.allowToShowSwitchMarket = false;
    this.currencyCode = '';
}

const geoInitialState = new GeoStoreState();
export default geoInitialState;
