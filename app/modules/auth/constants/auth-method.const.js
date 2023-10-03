const AuthMethodConst = {};

AuthMethodConst.GOOGLE = 'google-oauth2';
AuthMethodConst.FACEBOOK = 'facebook';
AuthMethodConst.APPLE = 'apple';
AuthMethodConst.SMS = 'sms';
AuthMethodConst.EMAIL = 'email';

Object.freeze(AuthMethodConst);
export default AuthMethodConst;
