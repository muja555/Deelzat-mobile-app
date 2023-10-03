//@flow
import HrcInput from "deelzat/types/Input";
export default class GroupsInput extends HrcInput{

    componentFilter: string;
    category: string;
    countryCode: string;

    constructor() {
        super();
    }

    payload() {

        let facetFilters = [
            'is_active:true'
        ];

        if (this.category) {
            facetFilters = [...facetFilters, `category:${this.category}`];
        }

        return {
            facetFilters: facetFilters,
            tagFilters: [
                this.componentFilter
            ],
            filters: `country_codes : ${this.countryCode}`
        }
    }
}
