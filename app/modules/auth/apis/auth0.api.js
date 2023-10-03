import Auth0 from 'react-native-auth0';
import Keys from "environments/keys";
import PasswordLessWithSmsInput from "modules/auth/inputs/password-less-with-sms.input";
import LoginWithSmsInput from "modules/auth/inputs/login-with-sms.input";
import Auth0RefreshTokenInput from "modules/auth/inputs/auth0-refresh-token.input";
import Auth0GetUserInput from "modules/auth/inputs/auth0-get-user.input";
import PasswordLessWithEmailInput from "modules/auth/inputs/password-less-with-email.input";
import LoginWithEmailInput from "modules/auth/inputs/login-with-email.input";
import LoginWithSocialInput from "modules/auth/inputs/login-with-social.input";
import LoginWithNativeFacebookInput from 'modules/auth/inputs/login-with-native-facebook.input';
import FetchFacebookProfileInput from 'modules/auth/inputs/fetch-facebook-profile.input';

const Auth0Client = new Auth0(Keys.Auth0);
const Auth0Api = {};

Auth0Api.passwordLessWithSMS = async (inputs: PasswordLessWithSmsInput) => {
    return Auth0Client.auth.passwordlessWithSMS(inputs.payload());
};

Auth0Api.passwordLessWithEmail = async (inputs: PasswordLessWithEmailInput) => {
    return Auth0Client.auth.passwordlessWithEmail(inputs.payload());
};

Auth0Api.loginWithSMS = async (inputs: LoginWithSmsInput) => {
    return Auth0Client.auth.loginWithSMS(inputs.payload());
};

Auth0Api.loginWithEmail = async (inputs: LoginWithEmailInput) => {
    return Auth0Client.auth.loginWithEmail(inputs.payload());
};

Auth0Api.loginWithSocial = async (inputs: LoginWithSocialInput) => {
    return Auth0Client.webAuth.authorize(inputs.payload());
}

Auth0Api.loginWithNativeFacebook = async (inputs: LoginWithNativeFacebookInput) => {
    return Auth0Client.auth.exchangeNativeSocial(inputs.payload());
}

Auth0Api.refreshToken = async (inputs: Auth0RefreshTokenInput) => {
    return Auth0Client.auth.refreshToken(inputs.payload());
};

Auth0Api.getUser = async (inputs: Auth0GetUserInput) => {
    return Auth0Client.users(inputs.accessToken).getUser(inputs.payload());
};


Auth0Api.fetchFacebookProfile = async (inputs: FetchFacebookProfileInput) => {

    const requestOptions = {
        method: 'GET',
    };

    return fetch(`https://graph.facebook.com/v13.0/${inputs.userId}?access_token=${inputs.accessToken}&fields=picture,email,name`, requestOptions)
        .then(response => response.json());
};

export default Auth0Api;
