import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iDailySummary extends iCrud {
  date?: string,
  total_amount?: number,
  pay_amount?: number,
  remain_amount?: number,
  number_of_customer?: number,
  number_of_bill?: number,
  number_of_customer_using_promotion?: number,
  number_of_sent_successfully_status?: number,
  number_of_distributed_status?: number,
  number_of_waiting_for_confirmation_status?: number,
  number_of_bill_confirmed_status?: number,
  number_of_picking_up_status?: number,
  number_of_received_status?: number,
  number_of_processing_status?: number,
  number_of_prepared_status?: number,
  number_of_sent_shipper_status?: number,
  number_of_delivering_status?: number,
  number_of_paid_status?: number,
  number_of_collected_money_status?: number,
  number_of_cancelled_status?: number
}

export class DailySummary extends CrudAPI<iDailySummary> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'daily_summary')
  }
}
