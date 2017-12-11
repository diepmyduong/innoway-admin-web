import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iEmployee extends iCrud {
    avatar?: string,
    branch_id?: string,
    brand_id?: string,
    email?: string,
    fullname?: string,
    password?: string,
    phone?: string,
    username?: string,
    user_id?: string,
    rate?: number,
    employee_type?: 'anonymous' | 'customer' | 'operator' | 'shipper' | 'checker' | 'manager' | 'admin' | 'super_admin',
}

export class Employee extends CrudAPI<iEmployee> {
    constructor(
        public api: InnowayApiService
    ) {
        super(api, 'employee')
    }
}