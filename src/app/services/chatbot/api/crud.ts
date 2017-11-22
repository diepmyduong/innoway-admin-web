import { BaseAPI } from './base'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { ChatbotApiService } from '../chatbot-api.service'
import * as _ from 'lodash'

export interface crudOptions {
    reload?: boolean
    local?: boolean
    query?: crudQuery
}

export interface crudQuery {
    filter?: any
    fields?: any[]
    order?: any[]
    items?: any[]
    limit?: number
    page?: number
    offset?: number
    populates?: any[]
    [x: string]: any
}

export interface iCrud {
    _id?: string
    createAt?: Date
    status?: string
    updateAt?: Date

    [key:string]: any
}

export interface iCrudPagination {
    current_page?: number
    limit?: number
    next_page?: number
    prev_page?: number
    totalItems?: number
}

export class CrudAPI<T> extends BaseAPI {
    constructor(
        public api: ChatbotApiService, 
        public moduleName: string
    ) {
        super(api,moduleName)
        this.options = {
            reload: true, //Auto update items list each request, 'false' to get result only.
            local: true, //Get local data instant request server.
            query: {}
        }
        this.items = new BehaviorSubject<T[]>([])
        this.pagination = {
            current_page: 0,
            limit: 20,
            next_page: 2,
            prev_page: 0,
            totalItems: 0
        }
    }
    options: crudOptions
    items: BehaviorSubject<T[]>
    pagination: iCrudPagination

    async getList(options?: crudOptions): Promise<T[]> {
        options = _.assign({}, this.options, options)
        let setting = {
            uri: this.apiUrl(),
            qs: this._paserQuery(options.query),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                'app_id': this.api.chatbotAuth.app._id,
                'app_token': this.api.chatbotAuth.app.accessToken
            },
            json: true // Automatically parses the JSON string in the response
        }
        let res = await this.exec(setting)
        let { results, pagination } = res
        let rows = results.objects.rows as T[]
        if (options.reload) {
            this.pagination = pagination
            this.pagination.totalItems = results.objects.count || 0
            this.items.next(rows)
        }
        return rows;
    }

    async getItem(id: string, options?: crudOptions): Promise<T> {
        if (!id) throw new Error("id undefined in getItem")
        options = _.assign({}, this.options, options)
        let setting = {
            method: 'GET',
            uri: this.apiUrl(id),
            qs: this._paserQuery(options.query),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                'app_id': this.api.chatbotAuth.app._id,
                'app_token': this.api.chatbotAuth.app.accessToken
            },
            json: true // Automatically parses the JSON string in the response
        }
        if (options.local) {
            let items = this.items.getValue()
            let item = _.find(items, { _id: id })
            if (item) return item
        }
        let res = await this.exec(setting)
        let row = res.results.object as T
        if (options.reload) {
            let items = this.items.getValue()
            let index = _.findIndex(items, { _id: id })
            if (index > -1) {
                items[index] = row
            } else {
                items.push(row)
            }
            this.items.next(items)
        }
        return row
    }

    async add(data: T, options?: crudOptions): Promise<T> {
        if (!data) throw new Error('data undefined in add')
        options = _.assign({}, this.options, options)
        let setting = {
            method: 'POST',
            uri: this.apiUrl(),
            qs: this._paserQuery(options.query),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                "content-type": "application/json",
                'app_id': this.api.chatbotAuth.app._id,
                'app_token': this.api.chatbotAuth.app.accessToken
            },
            body: data,
            json: true // Automatically parses the JSON string in the response
        }
        let res = await this.exec(setting)
        let row = res.results.object as T;
        if (options.reload) {
            let items = this.items.getValue()
            items.push(row)
            this.items.next(items)
        }
        return row
    }

    async update(id: string, data: T, options?: crudOptions): Promise<T> {
        if (!id) throw new Error('id undefined in edit')
        if (!data) throw new Error('data undefined in edit')
        options = _.assign({}, this.options, options)
        let setting = {
            method: 'PUT',
            uri: this.apiUrl(id),
            qs: this._paserQuery(options.query),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                "content-type": "application/json",
                'app_id': this.api.chatbotAuth.app._id,
                'app_token': this.api.chatbotAuth.app.accessToken
            },
            body: data,
            json: true // Automatically parses the JSON string in the response
        }
        let res = await this.exec(setting)
        let row = res.results.object as T
        if (options.reload) {
            let items = this.items.getValue()
            let index = _.findIndex(items, { _id: id })
            if (index > -1) {
                items[index] = row
            } else {
                items.push(row)
            }
            this.items.next(items)
        }
        return row
    }

    async delete(id: string, options?: crudOptions) {
        if (!id) throw new Error('id undefined in delete')
        options = _.assign({}, this.options, options)
        let setting = {
            method: 'DELETE',
            uri: this.apiUrl(id),
            qs: this._paserQuery(options.query),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                "content-type": "application/json",
                'app_id': this.api.chatbotAuth.app._id,
                'app_token': this.api.chatbotAuth.app.accessToken
            },
            json: true // Automatically parses the JSON string in the response
        }
        let res = await this.exec(setting)
        if (options.reload) {
            let items = this.items.getValue()
            _.remove(items, function (item) {
                return item._id == id;
            })
            this.items.next(items)
        }
        return true
    }

    async deleteAll(ids: string[], options?: crudOptions) {
        if (!ids) throw new Error('ids undefined in deleteAll')
        let setting = {
            method: 'DELETE',
            uri: this.apiUrl(),
            qs: this._paserQuery(_.assign({}, {
                items: ids
            }, options.query)),
            headers: { //headers
                'User-Agent': 'Request-Promise',
                "content-type": "application/json",
                'app_id': this.api.chatbotAuth.app._id,
                'app_token': this.api.chatbotAuth.app.accessToken
            },
            json: true // Automatically parses the JSON string in the response
        }
        let res: any = await this.exec(setting)
        if (options.reload) {
            let items = this.items.getValue()
            _.remove(items, function (item) {
                return _.indexOf(ids, item._id) !== -1
            });
            this.items.next(items)
        }
        return true
    }

    protected _paserQuery(query: crudQuery = {}) {
        let parsedQuery = _.merge({}, query)
        if (query.filter) {
            parsedQuery.filter = JSON.stringify(query.filter);
        }
        if (query.order) {
            parsedQuery.order = JSON.stringify(query.order);
        }
        if (query.scopes) {
            parsedQuery.scopes = JSON.stringify(query.scopes);
        }
        if (query.fields) {
            parsedQuery.fields = JSON.stringify(query.fields);
        }
        if (query.items) {
            parsedQuery.items = JSON.stringify(query.items);
        }
        if( query.populates) {
            parsedQuery.populates = JSON.stringify(query.populates)
        }
        return parsedQuery;
    }
}