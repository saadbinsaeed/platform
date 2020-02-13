/* @flow */
import { isObject } from 'app/utils/utils';


declare type ConfigType = {
    legacyWhere: ?boolean
};

/**
 * Creates and manipulates the query's options to send to our API.
 */
class OptionsBuilder {

    options: Object;
    config: ConfigType;

    /**
     * @param options the initial options.
     */
    constructor(options: ?Object, config: ?ConfigType) {
        this.options = options || {};
        this.config = config || { legacyWhere: false };
    }

    /**
     * Adds a filter.
     *
     * @param condition the condition to add.
     * @return this builder.
     */
    filter(condition: Object) {
        const filterByProp = this.config.legacyWhere ? 'where' : 'filterBy';
        let filterBy = this.options[filterByProp];
        if(isObject(filterBy)) {
            filterBy = [ filterBy, condition ];
        } else {
            filterBy = [ ...(filterBy || []), condition ];
        }
        this.options = { ...this.options, [filterByProp]: filterBy };
        return this;
    }

    /**
     * Sets the specified order if the query does not specify any order.
     *
     * @param order the default order.
     * @return this builder.
     */
    defaultOrder(order: Object | Array<Object>) {
        if (!this.options.orderBy) {
            this.options.orderBy = Array.isArray(order) ? order : [order];
        }
        return this;
    }

    /**
     * Sets the start and stop indexes if the query does not specify them.
     *
     * @param startIndex the default start index.
     * @param stopIndex the default stop index.
     * @return this builder.
     */
    defaultStartStopIndexs(startIndex: number, stopIndex: number) {
        if (!(this.options.startIndex >= 0)) {
            this.options.startIndex = startIndex;
        }
        if (!(this.options.stopIndex >= 0)) {
            this.options.stopIndex = stopIndex;
        }
        return this;
    }

    /**
     * @return the options.
     */
    build() {
        return this.options;
    }

}



export default OptionsBuilder;
