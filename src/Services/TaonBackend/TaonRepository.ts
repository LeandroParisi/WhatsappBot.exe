/* eslint-disable max-len */
import { Service } from "typedi"
// import { Message } from "venom-bot";
import Config from "../../Config/config"
import BranchData from "../../Data/DTOs/BranchData"
import Locations from "../../Data/DTOs/MemoryData/SubClasses/Locations"
import ILoginInfo from "../../Data/Interfaces/ILoginInfo"
import LoginData from "../../Data/Interfaces/LoginData"
import Customer from "../../Data/Models/Customer"
import { CustomerAddressSQL } from "../../Data/Models/CustomerAddress"
import { OrderSQL } from "../../Data/Models/Order"
import CheckCustomerOrdersDTO from "../../Domain/Flow/StepActions/ActionDefinitions/CheckCustomerOrdersAction/DTO/CheckCustomerOrdersDTO"
import Api from "../Shared/api"
import METHODS from "../Shared/methods"
import CalculateFaresBody from "./Requests/CalculateFaresBody"
import ValidateCoupomBody from "./Requests/ValidateCoupomBody"
import BotInitialLoadResponse from "./Responses/BotInitialLoadResponse"
import CalculateFaresResponse, { CalculatedFares } from "./Responses/CalculateFaresResponse"
import CheckCustomerResponse, { CheckCustomerDataReponse } from "./Responses/CheckCustomerResponse"
import ValidatedCoupom, { IsCoupomValidResponse } from "./Responses/IsCoupomValidResponse"
import LocationsResponse from "./Responses/LocationsResponse"
import { LoginDataResponse } from "./Responses/LoginDataResponse"
import RegisterOrderRes from "./Responses/RegisterOrderResponse"

@Service()
export default class TaonRepository {

  private readonly Api : Api

  constructor() {
    this.Api = new Api(Config.backendUrl)
  }

  async VerifyCoupomValidity(coupomCode: string, branchId: string, body: ValidateCoupomBody) : Promise<ValidatedCoupom> {
    const endpoint = `coupons/isValid/${branchId}/${coupomCode}`

    const response = await this.Api.Request<IsCoupomValidResponse>({
      endpoint, 
      method : METHODS.GET,
      body
    })

    return response.data
  }

  async CheckCustomerOrders(payload: CheckCustomerOrdersDTO) : Promise<OrderSQL[]> {
    const endpoint = `orders/byCustomerAndBranch/${payload.branchId}/${payload.customerId}?status=${payload.status.join(',')}`
    const response = await this.Api.Request<{data: OrderSQL[]}>({
      endpoint, 
      method : METHODS.GET,
    })

    return response.data
  }

  
  async Login(loginInfo : ILoginInfo) : Promise<LoginData> {
    const endpoint = "users/bot/login"

    const response = await this.Api.Request<LoginDataResponse>({
      endpoint, 
      method: METHODS.POST,
      body: loginInfo
    })

    return response.data
  }

  async ValidateSession(token : string) : Promise<void> {
    const endpoint = "users/bot/sessionAuth"

    await this.Api.Request({
      endpoint, 
      method: METHODS.POST,
      body: { token },
    })
  }

  async GetInitialData(token : string, whatsappNumber : string) : Promise<BranchData> {
    const endpoint = "branches/bot/initialLoad"

    const response = await this.Api.Request<BotInitialLoadResponse>({
      endpoint, 
      method: METHODS.GET,
      body: { whatsappNumber },
      headers: { auth: token }
    })

    return response.data
  }

  async GetLocations() : Promise<Locations> {
    const endpoint = "locations"

    const response = await this.Api.Request<LocationsResponse>({
      endpoint, 
      method: METHODS.GET,
    })

    return response.data
  }

  async CheckCustomerInfo(customer : Customer, message : any) : Promise<CheckCustomerDataReponse>{
    const endpoint = `customers/bot/checkCustomer/${message.from}`

    const response = await this.Api.Request<CheckCustomerResponse>({
      endpoint,
      method: METHODS.POST,
      body: {
        firstName: message.sender.shortName || message.sender.verifiedName || "Não identificado",
        id: customer._id
      }
    })

    return response.data
  }

  async SaveAddress(body : CustomerAddressSQL) : Promise<void> {
    const endpoint = `customersAddresses`

    const response = await this.Api.Request({
      endpoint,
      method: METHODS.POST,
      body
    })
  }

  async CalculateFares(body: OrderSQL) : Promise<CalculatedFares> {
    const endpoint = `orders/calculateFares`

    const response = await this.Api.Request<CalculateFaresResponse>({
      endpoint,
      method: METHODS.GET,
      body: new CalculateFaresBody(body)
    })

    return response.data
  }

  async RegisterOrder(body : OrderSQL) : Promise<string> {
    const endpoint = 'orders/register'

    const response = await this.Api.Request<RegisterOrderRes>({
      endpoint,
      method: METHODS.POST,
      body
    })

    return response.data
  }
}