import moment from "moment-timezone";
import pick from "lodash/pick";

//@flow
export default class HrcInput {

    _payload: string[];
    _query: string[];
    _dates: string[];
    _times: string[];
    _datesTimes: string[];

    constructor() {
        this._payload = [];
        this._query = [];
        this._dates = [];
        this._times = [];
        this._datesTimes = [];
    }

    formatValues(inputs) {

        let query = { ...inputs };

        for(let key in query) {
            let value = query[key];

            if (moment.isMoment(value)) {
                if (this._dates.indexOf(key) > -1) {
                    value = value.format('YYYY-MM-DD')
                }
                else if (this._times.indexOf(key) > -1) {
                    value = value.format('HH:mm')
                }
                else if (this._datesTimes.indexOf(key) > -1) {
                    value = value.format('YYYY-MM-DD HH:mm')
                }
            }

            query[key] = value;
        }

        return query;
    }

    payload(): Object {
        const payload = pick(this, this._payload);
        return this.formatValues(payload);
    }

    query(): Object {
        const query = pick(this, this._query);
        return this.formatValues(query);
    }
}
