function AuthStoreState() {
    this.auth0 = null;
    this.auth0User = null;
    this.isAuthenticated = false;
    this.checked = false;
}

const authInitialState = new AuthStoreState();
export default authInitialState;
