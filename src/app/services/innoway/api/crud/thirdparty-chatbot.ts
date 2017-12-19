import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iPaidHistory extends iCrud {
  app_id?: string,
  app_secret?: string,
  app_token?: string,
}


export class PaidHistory extends CrudAPI<iPaidHistory> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'paid_history')
  }

  async connect(params: {
    app_id: string,
    app_secret: string
  }) {
    let { app_id, app_secret } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`connect_chatbot`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { app_id, app_secret }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }

  async getStories() {
    let setting = {
      method: 'GET',
      uri: this.apiUrl(`get_stories`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }
}
