import { CrudAPI, iCrud, crudOptions } from '../crud'
import { InnowayApiService } from '../../innoway-api.service'
import * as _ from 'lodash'
import { iTopping } from 'app/services/innoway';
import { iProductTopping } from 'app/services/innoway/api/crud/product-topping';

export interface iProduct extends iCrud {
    base_price?: number,
    brand_id?: string,
    category_id?: string,
    description?: string,
    list_image?: string[],
    name?: string,
    price?: number,
    product_type_id?: string,
    thumb?: string,
    unit_id?: string,
    short_description?: string,
    thirdparty_id?: string,
    link?: string,
    code?: number,
    is_available?: boolean,
    rate?: number,

    toppings?: iProductTopping[]
}

export class Product extends CrudAPI<iProduct> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'product')
    }

    async addToppings(id: string, toppingIds: string[], options?: crudOptions) {
        options = _.assign({}, this.options, options)
        let setting = {
            method: 'POST',
            uri: this.apiUrl(`${id}/toppings`),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                'access_token': this.api.innowayAuth.adminToken
            },
            json: true,
            body: { topping_ids: toppingIds }
        }
        let res: any = await this.exec(setting);
        let rows = res.results.object.rows
        return rows;
    }

    async updateToppings(id: string, toppingIds: string[], options?: crudOptions) {
        options = _.assign({}, this.options, options)
        let setting = {
            method: 'PUT',
            uri: this.apiUrl(`${id}/toppings`),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                'access_token': this.api.innowayAuth.adminToken
            },
            json: true,
            body: { topping_ids: toppingIds }
        }
        let res: any = await this.exec(setting);
        let rows = res.results.object.rows
        return rows;
    }
}