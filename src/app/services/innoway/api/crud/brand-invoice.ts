import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iBrandInvoice extends iCrud {

}

export class BrandInvoice extends CrudAPI<iBrandInvoice> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'brand_invoice')
  }

  async connect(params: any
  //   {
  //   app_secret: string,
  //   tax_num: string,
  //   meta_data: JSON,
  //   sending_method: string
  //   // 'REGIS',
  //   // 'AUTO'
  // }
) {
    // let {
    //   app_secret,
    //   tax_num,
    //   meta_data,
    //   sending_method,
    // } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`connect`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: params
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }
}
