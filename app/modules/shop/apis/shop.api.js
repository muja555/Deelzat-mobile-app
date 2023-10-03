import Http from "deelzat/http";
import ShopGetInput from "modules/shop/inputs/shop-get.input";
import ShopFollowersCountGetInput from "modules/shop/inputs/shop-followers-count-get.input";
import ShopEditInput from "modules/shop/inputs/shop-edit.input";
import ShopFollowingListGetInput from 'modules/shop/inputs/shop-following-list-get-input';
import ShopFollowPost from 'modules/shop/inputs/shop-follow-shop-post'
import ShopUnfollowInput from 'modules/shop/inputs/shop-unfollow-input'

const ShopApi = {};

ShopApi.list = async () => {
    return Http.get('/app/shop/', {})
};

ShopApi.get = async (inputs: ShopGetInput) => {
    return Http.get('/app/shop/' + inputs.shop_id, {})
};

ShopApi.followersCountGet = async (inputs: ShopFollowersCountGetInput) => {
    return Http.get('/app/shop/' + inputs.shop_id + '/followers/count', {})
};

ShopApi.followShop = async (inputs: ShopFollowPost) => {
    return Http.post('/app/shop/' + inputs.shop_id + '/follow', inputs.payload());
}

ShopApi.unFollowShop = async (inputs: ShopUnfollowInput) => {
    return Http.delete('/app/shop/' + inputs.shop_id + '/unfollow');
}

ShopApi.edit = async (inputs: ShopEditInput) => {
    return Http.post('/app/shop', inputs.payload())
};

ShopApi.getFollowingList = async (inputs: ShopFollowingListGetInput) => {
    return Http.get('/app/shop/' + inputs.shop_id + '/following/shops', inputs.query())
}

ShopApi.getFollowersList = async (inputs: ShopFollowingListGetInput) => {
    return Http.get('/app/shop/' + inputs.shop_id + '/followers/users', inputs.query())
}

export default ShopApi;
