import { ICustomerInfoSql } from "../../../Data/DTOs/CustomerInfo"

export interface CheckCustomerDataReponse {
  customerInfo : ICustomerInfoSql,
  information? : {
    hasOrders? : boolean 
  }
}

export default interface CheckCustomerResponse {
  data : CheckCustomerDataReponse
}