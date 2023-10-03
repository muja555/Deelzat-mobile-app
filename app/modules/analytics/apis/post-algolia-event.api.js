import PostAlgoliaEventInput from "modules/analytics/inputs/post-algolia-event.input";
import Keys from "environments/keys";
import UserAgent from 'react-native-user-agent';

const PostAlgoliaEventApi = {};

PostAlgoliaEventApi.sendEvent = async (inputs: PostAlgoliaEventInput) => {

    const requestOptions = {
        method: 'POST',
        headers: {
            'X-Algolia-Agent': UserAgent.getUserAgent(),
            'x-algolia-api-key': Keys.Algolia.apiKey,
            'x-algolia-application-id': Keys.Algolia.appId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs.payload())
    };

    return fetch('https://insights.algolia.io/1/events', requestOptions);
};

export default PostAlgoliaEventApi;
