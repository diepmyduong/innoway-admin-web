import { Injectable } from '@angular/core';
import { InnowayAuthService } from './innoway-auth.service'
import { InnowayConfigService } from './innoway-config.service'
import { FcmService } from './fcm.service'
import { Attribute } from './api/crud/attribute'
import { Product } from './api/crud/product'
import { ProductCategory } from './api/crud/product-category'
import { ProductType } from './api/crud/product-type'
import { Topping } from './api/crud/topping'
import { Unit } from './api/crud/unit'
import { ShipArea } from './api/crud/ship-area'
import { Brand } from './api/crud/brand'
import { Branch } from './api/crud/branch'
import { Bill } from './api/crud/bill'
import { BillActivity } from './api/crud/bill-activity'
import { Employee } from './api/crud/employee'
import { PaidHistory } from './api/crud/paid-history'
import { Promotion } from './api/crud/promotion'
import { CustomerType } from './api/crud/customer-type'
import { Customer } from './api/crud/customer'
import { BrandShip } from './api/crud/brand-ship';
import { PromotionType } from './api/crud/promotion-type'
import { ToppingValue } from './api/crud/topping-value'
import { CustomerTypePromotion } from './api/crud/customer-type-promotion'
import { BillSubFee } from './api/crud/bill-sub-fee'
import { BillRelatedPeople } from './api/crud/bill-related-people'
import { ThirdPartyChatbot } from './api/crud/thirdparty-chatbot'
import { DailySummary } from './api/crud/daily-summary'
import { SmartCode } from './api/crud/smart-code'
import { BrandTheme } from './api/crud/brand-theme'
import { BrandCategory } from './api/crud/brand-category'
import { PromotionCustomer } from './api/crud/promotion-customer'
import { PromotionCustomerDetail } from './api/crud/promotion-customer-detail'
import { Summary } from './api/crud/summary'
import { Upload } from "./api/crud/upload";
import { Contract } from "./api/crud/contract";
import { License } from "./api/crud/license";
import { LicenseDetail } from "./api/crud/license-detail";
import { Device } from "./api/crud/device";
import { Room } from "./api/crud/room";
import { Scene } from "./api/crud/scene";
import { TicketComment } from "./api/crud/ticket-comment";
import { TicketType } from "./api/crud/ticket-type";
import { Ticket } from "./api/crud/ticket";
import { Shipment } from "./api/crud/shipment";
import { ShipmentDetail } from "./api/crud/shipment-detail";
import { ShipmentArea } from "./api/crud/shipment-area";
import { ThirdpartyGHNHub } from "./api/crud/thirdparty-ghn-hub";
import { ThirdpartyGHNOrder } from "./api/crud/thirdparty-ghn-order";
import { ThirdpartyGHNService } from "./api/crud/thirdparty-ghn-service";
import { ThirdpartyKiotViet } from "./api/crud/thirdparty-kiotviet";
import { ThirdpartyShipper } from "./api/crud/thirdparty-shipper";
import { McomManager } from "./api/crud/mcom-manager";
import { McomManagerType } from "./api/crud/mcom-manager-type";
import { ThirdpartyHaravan } from "./api/crud/thirdparty-haravan";
import { AutoBillStatusSetting } from "./api/crud/auto-bill-status-setting";
import { VNPay } from "./api/crud/vnpay";
import { Blog } from "./api/crud/blog";
import { BlogType } from "./api/crud/blog-type";
import { TicketResult } from "./api/crud/ticket-result";
import { ExportHistory } from "./api/crud/export-history";
import { ImportHistory } from "./api/crud/import-history";
import { Store } from "./api/crud/store";
import { Supplier } from "./api/crud/supplier";
import { SupplierCategory } from "./api/crud/supplier_category";
import { Inventory } from "./api/crud/inventory";
import { AuthCustomer } from "./api/crud/auth-customer";
import { CustomerReport } from "./api/crud/customer-report";
import { BrandInvoice } from "app/services/innoway/api/crud/brand-invoice";

@Injectable()
export class InnowayApiService {

  constructor(
    public innowayConfig: InnowayConfigService,
    public innowayAuth: InnowayAuthService,
    public fcm: FcmService
  ) {

  }
  attribute = new Attribute(this)
  product = new Product(this)
  productCategory = new ProductCategory(this)
  productType = new ProductType(this)
  topping = new Topping(this)
  unit = new Unit(this)
  shipArea = new ShipArea(this)
  brand = new Brand(this)
  branch = new Branch(this)
  bill = new Bill(this)
  billActivity = new BillActivity(this)
  employee = new Employee(this)
  paidHistory = new PaidHistory(this)
  promotion = new Promotion(this)
  customerType = new CustomerType(this)
  customer = new Customer(this)
  brandShip = new BrandShip(this)
  promotionType = new PromotionType(this)
  toppingValue = new ToppingValue(this)
  customerTypePromotion = new CustomerTypePromotion(this)
  billSubFee = new BillSubFee(this)
  billRelatedPeople = new BillRelatedPeople(this)
  thirdpartyChatbot = new ThirdPartyChatbot(this)
  dailySummary = new DailySummary(this)
  smartCode = new SmartCode(this)
  brandTheme = new BrandTheme(this)
  brandCategory = new BrandCategory(this)
  promotionCustomer = new PromotionCustomer(this)
  promotionCustomerDetail = new PromotionCustomerDetail(this)
  summary = new Summary(this)
  upload = new Upload(this)
  contract = new Contract(this)
  license = new License(this)
  licenseDetail = new LicenseDetail(this)
  room = new Room(this)
  device = new Device(this)
  scene = new Scene(this)

  ticket = new Ticket(this)
  ticketType = new TicketType(this)
  ticketComment = new TicketComment(this)
  ticketResult = new TicketResult(this)

  shipment = new Shipment(this)
  shipmentDetail = new ShipmentDetail(this)
  shipmentArea = new ShipmentArea(this)

  thirdpartyGHNHub = new ThirdpartyGHNHub(this)
  thirdpartyGHNOrder = new ThirdpartyGHNOrder(this)
  thirdpartyGHNService = new ThirdpartyGHNService(this)

  thirdpartyKiotViet = new ThirdpartyKiotViet(this)
  thirdpartyHaravan = new ThirdpartyHaravan(this)

  thirdpartyShipper = new ThirdpartyShipper(this)

  mcomManager = new McomManager(this)
  mComManagerType = new McomManagerType(this)

  autoBillStatusSetting = new AutoBillStatusSetting(this)

  vnpay = new VNPay(this)

  blog = new Blog(this)
  blogType = new BlogType(this)

  inventory = new Inventory(this)
  exportHistory = new ExportHistory(this)
  importHistory = new ImportHistory(this)

  store = new Store(this)
  supplier = new Supplier(this)
  supplierCategory = new SupplierCategory(this)

  authCustomer = new AuthCustomer(this)
  customerReport = new CustomerReport(this)

  brandInvoice = new BrandInvoice(this)
}
