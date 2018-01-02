import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iSmartCode extends iCrud {
  code_type?: string,
  is_connect_chatbot?: boolean,
  code?: string,
  strat_time?: string,
  end_time?: string,
  content?: string,
  hide_content?: string,
  link?: string,
  qr_code_image?: string,
  messenger_code_image?: string,
  amount?: number,
  limit?: number,
  status?: number,
}

export class SmartCode extends CrudAPI<iSmartCode> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'smart_code')
  }
}
