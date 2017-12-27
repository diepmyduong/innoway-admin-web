import { BaseAPI } from './base'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { InnowayApiService } from '../innoway-api.service'
import * as _ from 'lodash'
import * as hash from 'object-hash'

export interface crudOptions {
    reload?: boolean
    local?: boolean
    query?: crudQuery
    headers?: any
}

export interface crudQuery {
    filter?: any
    fields?: any[]
    order?: any[]
    items?: any[]
    limit?: number
    page?: number
    offset?: number
    [x: string]: any
}

export interface iCrud {
    id?: string
    created_at?: Date
    deleted_at?: Date
    status?: number
    updated_at?: Date

    [key: string]: any
}

export interface iCrudPagination {
    current_page?: number
    limit?: number
    next_page?: number
    prev_page?: number
    totalItems?: number
    pageItemsCount?: number
}

export class CrudAPI<T> extends BaseAPI {
    constructor(
        public api: InnowayApiService,
        public moduleName: string
    ) {
        super(api, moduleName)
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
        this.hashCache = {}
    }
    options: crudOptions
    items: BehaviorSubject<T[]>
    pagination: iCrudPagination
    localBrandName: string
    hashCache: {
        [hash: string]: {
            pagination: iCrudPagination
            items: T[]
        }
    }
    activeHashQuery: string
    activeQuery: crudQuery = {}

    async getList(options?: crudOptions): Promise<T[]> {
        options = _.merge({}, this.options, options)
        let setting = {
            uri: this.apiUrl(),
            qs: this._paserQuery(options.query),
            headers: _.merge({}, { //headers
                'User-Agent': 'Request-Promise',
                'access_token': this.api.innowayAuth.adminToken
            }, options.headers),
            json: true // Automatically parses the JSON string in the response
        }
        const hashedQuery = hash(options.query)
        this.activeHashQuery = hashedQuery
        this.activeQuery = options.query

        if (options.local && this.hashCache[hashedQuery] && this.localBrandName == this.api.innowayConfig.brandName) {
            let items = this.hashCache[hashedQuery].items
            this.pagination = this.hashCache[hashedQuery].pagination
            if (items.length > 1) { // If local empty, request to server
                return items
            }
        }
        if (this.localBrandName != this.api.innowayConfig.brandName)
            this.localBrandName = this.api.innowayConfig.brandName
        let res = await this.exec(setting)
        let { results, pagination } = res
        let rows = results.objects.rows as T[]
        if (options.reload) {
            this.pagination = pagination
            this.pagination.totalItems = results.objects.count || 0
            this.hashCache[hashedQuery] = {
                pagination: this.pagination,
                items: rows
            }
            this.items.next(rows)
        }
        return rows;
    }

    async getItem(id: string, options?: crudOptions): Promise<T> {
        if (!id) throw new Error("id undefined in getItem")
        options = _.merge({}, this.options, options)
        let setting = {
            method: 'GET',
            uri: this.apiUrl(id),
            qs: this._paserQuery(options.query),
            headers: _.merge({}, { //headers
                'User-Agent': 'Request-Promise',
                'access_token': this.api.innowayAuth.adminToken
            }, options.headers),
            json: true // Automatically parses the JSON string in the response
        }
        const hashedQuery = hash(options.query)
        if (options.local && this.hashCache[hashedQuery] && this.localBrandName == this.api.innowayConfig.brandName) {
            let items = this.hashCache[hashedQuery].items
            let item = _.find(items, { id: id })
            if (item) return item
        }
        if (this.localBrandName != this.api.innowayConfig.brandName)
            this.localBrandName = this.api.innowayConfig.brandName
        let res = await this.exec(setting)
        let row = res.results.object as T
        if (options.reload) {
            if(hashedQuery === this.activeHashQuery) {
                let items = this.items.getValue()
                let index = _.findIndex(items, { id: id })
                if (index > -1) {
                    items[index] = row
                } else {
                    items.push(row)
                }
                this.hashCache[this.activeHashQuery].items = items
                this.hashCache = {
                    [this.activeHashQuery]: this.hashCache[this.activeHashQuery]
                }
                this.items.next(items)
            } else {
                if(!this.hashCache[hashedQuery]) this.hashCache[hashedQuery] = {
                    pagination: {},
                    items: []
                }
                let index = _.findIndex(this.hashCache[hashedQuery].items, { id: id })
                if (index > -1) {
                    this.hashCache[hashedQuery].items[index] = row
                } else {
                    this.hashCache[hashedQuery].items.push(row)
                }
            }
        }
        return row
    }

    async add(data: T, options?: crudOptions): Promise<T> {
        if (!data) throw new Error('data undefined in add')
        options = _.merge({}, this.options, options)
        let setting = {
            method: 'POST',
            uri: this.apiUrl(),
            qs: this._paserQuery(options.query),
            headers: _.merge({}, { //headers
                'User-Agent': 'Request-Promise',
                "content-type": "application/json",
                'access_token': this.api.innowayAuth.adminToken
            }, options.headers),
            body: data,
            json: true // Automatically parses the JSON string in the response
        }
        let res = await this.exec(setting)
        let row = res.results.object as T;
        if (options.reload) {
            let items = this.items.getValue()
            if(items.length < this.pagination.limit) {
                this.items.next(items)
                this.hashCache[this.activeHashQuery].items = items
                items.push(row)

            }
            this.hashCache = {
                [this.activeHashQuery]: this.hashCache[this.activeHashQuery]
            }
        }
        return row
    }

    async update(id: string, data: T, options?: crudOptions): Promise<T> {
        if (!id) throw new Error('id undefined in edit')
        if (!data) throw new Error('data undefined in edit')
        options = _.merge({}, this.options, options)
        let setting = {
            method: 'PUT',
            uri: this.apiUrl(id),
            qs: this._paserQuery(options.query),
            headers: _.merge({}, { //headers
                'User-Agent': 'Request-Promise',
                "content-type": "application/json",
                'access_token': this.api.innowayAuth.adminToken
            }, options.headers),
            body: data,
            json: true // Automatically parses the JSON string in the response
        }
        let res = await this.exec(setting)
        let row = res.results.object as T
        if (options.reload) {
            let items = this.items.getValue()
            let index = _.findIndex(items, { id: id })
            if (index > -1) {
                items[index] = row
                this.hashCache[this.activeHashQuery].items = items
                this.items.next(items)
            }
            this.hashCache = {
                [this.activeHashQuery]: this.hashCache[this.activeHashQuery]
            }
        }
        return row
    }

    async delete(id: string, options?: crudOptions) {
        if (!id) throw new Error('id undefined in delete')
        options = _.merge({}, this.options, options)
        let setting = {
            method: 'DELETE',
            uri: this.apiUrl(id),
            qs: this._paserQuery(options.query),
            headers: _.merge({}, { //headers
                'User-Agent': 'Request-Promise',
                "content-type": "application/json",
                'access_token': this.api.innowayAuth.adminToken
            }, options.headers),
            json: true // Automatically parses the JSON string in the response
        }
        let res = await this.exec(setting)

        if (options.reload) {
            let items = this.items.getValue()
            const removed = _.remove(items, function (item) {
                return item.id == id;
            })
            if(removed.length > 0) {
                this.hashCache[this.activeHashQuery].items = items
                this.hashCache = {
                    [this.activeHashQuery]: this.hashCache[this.activeHashQuery]
                }
                this.items.next(items)
            }else {
                await this.getList({ local: false, query: this.activeQuery })
            }
            this.hashCache = {
                [this.activeHashQuery]: this.hashCache[this.activeHashQuery]
            }
        }
        return true
    }

    async deleteAll(ids: string[], options?: crudOptions) {
        if (!ids) throw new Error('ids undefined in deleteAll')
        options = _.merge({}, this.options, options)
        let setting = {
            method: 'DELETE',
            uri: this.apiUrl(),
            qs: this._paserQuery(_.merge({}, {
                items: ids
            }, options.query)),
            headers: _.merge({}, { //headers
                'User-Agent': 'Request-Promise',
                "content-type": "application/json",
                'access_token': this.api.innowayAuth.adminToken
            }, options.headers),
            json: true // Automatically parses the JSON string in the response
        }
        let res: any = await this.exec(setting)
        if (options.reload) {
            let items = this.items.getValue()
            const removed = _.remove(items, function (item) {
                return _.indexOf(ids, item.id) !== -1
            });
            if(removed.length > 0) {
                this.hashCache[this.activeHashQuery].items = items
                this.hashCache = {
                    [this.activeHashQuery]: this.hashCache[this.activeHashQuery]
                }
                this.items.next(items)
            }else {
                await this.getList({ local: false, query: this.activeQuery })
            }
            this.hashCache = {
                [this.activeHashQuery]: this.hashCache[this.activeHashQuery]
            }
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
        return parsedQuery;
    }
}
