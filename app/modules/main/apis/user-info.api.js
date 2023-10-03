import Http from "deelzat/http";
import UserInfoUpdateInput from "modules/main/inputs/user-info-update.input";

const UserInfoApi = {};

UserInfoApi.getUserInfo = async () => {
    return Http.get(`/app/users`)
};

UserInfoApi.updateUserInfo = async (inputs: UserInfoUpdateInput) => {
    return Http.post('/app/users', inputs.payload())
}

export default UserInfoApi;
