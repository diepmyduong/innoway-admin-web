import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iThirdpartyShipper extends iCrud {

}

export class ThirdpartyShipper extends CrudAPI<iThirdpartyShipper> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'thirdparty_shipper')
  }

  async calculateShipFee(params: {
    type: 'MCOM' | 'GHN' | 'GHTK' | 'UBER_DELIVER',
    data: any
  }) {
    let { type, data } = params;
    let setting = {
      method: 'POST',
      uri: this.apiUrl(`calculate_ship_fee`),
      headers: {
        'User-Agent': 'Request-Promise',
        'access_token': this.api.innowayAuth.adminToken
      },
      json: true,
      body: {}
    }

    switch (type) {
      case 'GHN': {
        setting.body = {
          type: 'GHN',
          weight: data.weight,
          from_district: data.from_district,
          to_district: data.to_district,
          // brand_id: data.brand_id
        }
        break
      }
      case 'GHTK': {
        setting.body = {
          type: 'GHTK',
          // brand_id: data.brand_id,
          pick_address_id: data.pick_address_id,
          pick_address: data.pick_address,
          pick_province: data.pick_province,
          pick_district: data.pick_district,
          pick_ward: data.pick_ward,
          pick_street: data.pick_street,
          address: data.address,
          province: data.province,
          district: data.district,
          ward: data.ward,
          street: data.street,
          weight: data.weight,
          value: data.value
        }
        break
      }
      case 'UBER_DELIVER': {
        setting.body = {
          type: 'UBER_DELIVER',
          end_longitude: data.end_longitude,
          end_latitude: data.end_latitude,
          start_longitude: data.start_longitude,
          start_latitude: data.start_latitude,
          // brand_id: data.brand_id,
          user_token: data.user_token
        }
        break
      }
      case 'MCOM':
      default: {
        setting.body = {
          type: 'MCOM',
          end_longitude: data.end_longitude,
          end_latitude: data.end_latitude,
          // brand_id: data.brand_id
        }
        break
      }
    }

    let res: any = await this.exec(setting);
    let rows = res.results.object;
    return rows;
  }
}
