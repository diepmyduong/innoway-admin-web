import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iPromotion extends iCrud {
    amount?: number,
    brand_id?: string,
    code?: string,
    description?: string,
    end_date?: Date,
    limit?: number,
    name?: string,
    promotion_type_id?: string,
    promotion_type?: 'discount_by_percent' | 'discount_by_price' | 'discount_by_gift',
    start_date?: Date,
    value?: number,
    image?: string,
    short_description?: string,
}

export class Promotion extends CrudAPI<iPromotion> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'promotion')
    }

    async addCustomerTypes(id: string, customer_type_ids: string[]) {
        let setting = {
            method: 'POST',
            uri: this.apiUrl(`${id}/customer_types`),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                'access_token': this.api.innowayAuth.adminToken
            },
            json: true,
            body: { customer_type_ids }
        }
        let res: any = await this.exec(setting);
        let rows = res.results.object.rows
        return rows;
    }

    async updateCustomerType(id: string, customer_type_ids: string[]) {
        let setting = {
            method: 'PUT',
            uri: this.apiUrl(`${id}/customer_types`),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                'access_token': this.api.innowayAuth.adminToken
            },
            json: true,
            body: { customer_type_ids }
        }
        let res: any = await this.exec(setting);
        let rows = res.results.object.rows
        return rows;
    }

    async sendPromotionToMessenger(id:string, message: string) {
        let setting = {
            method: 'PUT',
            uri: this.apiUrl(`${id}/customer_types`),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                'access_token': this.api.innowayAuth.adminToken
            },
            json: true,
            body: { message }
        }
        let res: any = await this.exec(setting);
        return res;
    }
}