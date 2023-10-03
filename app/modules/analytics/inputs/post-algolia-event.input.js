//@flow
import HrcInput from "deelzat/types/Input";
export default class PostAlgoliaEventInput extends HrcInput{

    //payload
    eventType: string;
    eventName: string;
    index: string;
    userToken: string;
    queryID: string;
    objectIDs: string[];
    objectID: string;
    filters: string[];
    positions: number[];
    position: number;

    constructor() {
        super();
    }

    payload(): Object {

        const event = {
            eventType: this.eventType,
            eventName: this.eventName,
            index: this.index,
            userToken: this.userToken,
            queryID: this.queryID,
            objectIDs: this.objectIDs,
            objectID: this.objectID,
            filters: this.filters,
            positions: this.positions,
            products: this.products,
            position: this.position,
        }

        return {
            events: [event],
        };
    }

}
