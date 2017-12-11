import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iBill extends iCrud {
    address?: string,
    bill_activity_id?: string,
    bill_ship_detail_id?: string,
    brand_id?: string,
    customer_id?: string,
    latitude?: number,
    longitude?: number,
    note?: string,
    promotion_id?: string,
    total_price?: number,
    bill_items_total_price?: number,
    channel?: 'at_store' | 'hot_line' | 'facebook' | 'chatbot' | 'website' | 'application',
    vat_fee?: number,
    current_paid_history_id?: string,
    code?: number,
}

export class Bill extends CrudAPI<iBill> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'bill')
    }
}