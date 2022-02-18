import { Service } from "typedi"
// import { Message } from "venom-bot";
import BranchData, { City, Country, State } from "../../../data/DTOs/BranchData";
import CustomerInfo, { CustomerInfoSql } from "../../../data/DTOs/CustomerInfo";
import LoginData from "../../../data/Interfaces/LoginData";
import Customer from "../../../data/Models/Customer";
import CustomerAddress, { CustomerAddressSQL } from "../../../data/Models/CustomerAddress";
import Api from "../Shared/api";
import Config from "../../config";
import { LoginDataResponse } from "./Responses/LoginDataResponse";
import BotInitialLoadResponse from "./Responses/BotInitialLoadResponse";
import Locations from "../../../data/DTOs/MemoryData/SubClasses/Locations";
import LocationsResponse from "./Responses/LocationsResponse";
import CheckCustomerResponse from "./Responses/CheckCustomerResponse";
import METHODS from "../Shared/methods";
import ValidatedCoupom, { IsCoupomValidResponse } from "./Responses/IsCoupomValidResponse";
import Order, { OrderSQL } from "../../../data/Models/Order";
import CalculateFaresResponse, { CalculatedFares } from "./Responses/CalculateFaresResponse";
import ValidateCoupomBody from "./Requests/ValidateCoupomBody";

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

  
  async Login(email : string, password : string) : Promise<LoginData> {
    const endpoint = "users/bot/login"

    const response = await this.Api.Request<LoginDataResponse>({
      endpoint, 
      method: METHODS.POST,
      body: { email, password },
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

  async CheckCustomerInfo(customer : Customer, message : any) : Promise<CustomerInfoSql>{
    const endpoint = `customers/bot/checkCustomer/${message.from}`

    const response = await this.Api.Request<CheckCustomerResponse>({
      endpoint,
      method: METHODS.POST,
      body: {
        firstName: message.sender.shortName || message.sender.verifiedName || "Não identificado",
        id: customer._id
      }
    })

    return new CustomerInfoSql(response.data)
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
      body
    })

    return response.data
  }
}