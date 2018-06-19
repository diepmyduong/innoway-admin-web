import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iAuthCustomer extends iCrud {

}

export class AuthCustomer extends CrudAPI<iAuthCustomer> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'auth')
  }

  async getCustomerTokenByPhone(params: {
    phone: string,
  }) {
    let { phone } = params
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`get_customer_token_by_phone`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: { phone }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return res;
  }

  async customerPrudLogin(params: {
    username: string,
    password: string
  }) {
    let { username, password } = params
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`customer_prud_login`),
      headers: { //headers
        'User-Agent': 'Request-Promise',
      },
      json: true,
      body: { username, password }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return res;
  }
}
