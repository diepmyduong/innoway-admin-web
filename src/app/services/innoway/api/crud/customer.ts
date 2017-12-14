import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iCustomer extends iCrud {
    account_type?: string,
    active_code?: string,
    avatar?: string,
    birthday?: Date,
    brand_id?: string,
    email?: string,
    fullname?: string,
    phone?: string,
    sex?: 'male' | 'female' | 'other',
    trust_point?: number,
    number_of_bill?: number,
    amount_of_purchase?: number,
    code?: string,
    last_date_order?: Date,
}

export class Customer extends CrudAPI<iCustomer> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'customer')
    }

    async getCustomerByPhone(params: { phone: string }) {
        const { phone } = params
        const setting = {
            method: 'POST',
            uri: this.apiUrl(`get_customer_by_phone`),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                'access_token': this.api.innowayAuth.adminToken
            },
            json: true,
            body: { phone }
        }
        const res: any = await this.exec(setting);
        const row = res.results.object
        return row;
    }
}