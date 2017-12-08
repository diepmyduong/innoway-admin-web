import { InnowayApiService } from './innoway-api.service'
import { InnowayAuthService, iUserRecord, iUserRecords } from './innoway-auth.service'
import { InnowayConfigService } from './innoway-config.service'
import { FirebaseAuthGuard } from './firebase-auth.guard'

export * from './api/crud/attribute'
export * from './api/crud/product'

export {
    InnowayApiService,
    InnowayAuthService, iUserRecord, iUserRecords,
    InnowayConfigService,
    FirebaseAuthGuard
}