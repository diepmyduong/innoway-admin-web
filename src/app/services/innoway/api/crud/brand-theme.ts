import { CrudAPI, iCrud, crudOptions } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iBrandTheme extends iCrud {
primary?:string,
light?:string,
dark?:string,
logo?:string,
banner_logo?:string,
banner_background_image?:string,
banner_background_color?:string,
default_product_image?:string,
default_product_color?:string,
default_promotion_cover?:string,
navbar_color?:string,
footer_color?:string,
price_color?:string,
logo_circle?:string,
}

export class BrandTheme extends CrudAPI<iBrandTheme> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'brand_theme')
  }

  async getTheme(options: crudOptions = {}) {
      const setting = {
          method: 'GET',
          qs: this._paserQuery(options.query),
          uri: this.apiUrl(`get_theme`),
          headers: { //headers
              'User-Agent': 'Request-Promise',
              'access_token': this.api.innowayAuth.adminToken
          },
          json: true,
      }
      let res: any = await this.exec(setting);
      let rows = res.results.objects.rows
      return rows;
  }
}
