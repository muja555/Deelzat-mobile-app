function AppStoreState() {
    this.data = [];
    this.isRemoteConfigsReady = false;
    this.swipeEnabled = true;
    this.appInitialized = false;
    this.isStagingApi = false;
    this.inAppPopup = null;
}

const appInitialState = new AppStoreState();
export default appInitialState;
