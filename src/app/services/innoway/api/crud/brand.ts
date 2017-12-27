import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iBrand extends iCrud {
  thirdparty_kiotviet_id?: string,
  color?: string,
  logo?: string,
  name?: string,
  trial_expire?: string,
  type?: number,
  brand_ship_id?: string,
  vat_value?: number,
  address?: string,
  phone?: string,
  code?: string,
}

export class Brand extends CrudAPI<iBrand> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'brand')
  }
  
  async registerNewBrand(params: {
    brand_name: string,
    brand_phone: string,
    brand_address: string,
    brand_code: string,
    longitude: number,
    latitude: number,
    admin_fullname: string,
    admin_phone: string,
    admin_email: string,
    admin_password: string
  }) {
    let { brand_name, brand_phone, brand_address, brand_code,
      admin_fullname, admin_phone, admin_email, admin_password,
      longitude, latitude } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`regis_brand`),
      headers: {
        'User-Agent': 'Request-Promise',
      },
      json: true,
      body: {
        brand_name, brand_phone, brand_address, brand_code,
        admin_fullname, admin_phone, admin_email, admin_password,
        longitude, latitude
      }
    }
    var res: any = await this.exec(setting);
    var row = res.results.object;
    return row;
  }
}
