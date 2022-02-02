import { Service } from "typedi"
// import { Message } from "venom-bot";
import BranchData, { City, Country, State } from "../../../data/DTOs/BranchData";
import CustomerInfo, { CustomerInfoSql } from "../../../data/DTOs/CustomerInfo";
import LoginData from "../../../data/Interfaces/LoginData";
import Customer from "../../../data/Models/Customer";
import CustomerAddress, { CustomerAddressSQL } from "../../../data/Models/CustomerAddress";
import Api from "../Shared/api";
import Config from "../../config";
import { LoginDataPayload } from "./Payloads/LoginDataPayload";
import BotInitialLoadPayload from "./Payloads/BotInitialLoadPayload";
import Locations from "../../../data/DTOs/MemoryData/SubClasses/Locations";
import LocationsPayload from "./Payloads/LocationsPayload";
import CheckCustomerPayload from "./Payloads/CheckCustomerPayload";

@Service()
export default class TaonRepository {
  private readonly Api : Api

  constructor() {
    this.Api = new Api(Config.backendUrl)
  }
  
  async Login(email : string, password : string) : Promise<LoginData> {
    const endpoint = "users/bot/login"
    const method = "POST"

    const response = await this.Api.Request<LoginDataPayload>({
      endpoint, 
      method,
      body: { email, password },
    })

    return response.data
  }

  async ValidateSession(token : string) : Promise<void> {
    const endpoint = "users/bot/sessionAuth"
    const method = "POST"

    await this.Api.Request({
      endpoint, 
      method,
      body: { token },
    })
  }

  async GetInitialData(token : string, whatsappNumber : string) : Promise<BranchData> {
    const endpoint = "branches/bot/initialLoad"
    const method = "GET"

    const response = await this.Api.Request<BotInitialLoadPayload>({
      endpoint, 
      method,
      body: { whatsappNumber },
      headers: { auth: token }
    })

    return response.data
  }

  async GetLocations() : Promise<Locations> {
    const endpoint = "locations"
    const method = "GET"

    const response = await this.Api.Request<LocationsPayload>({
      endpoint, 
      method,
    })

    return response.data
  }

  async CheckCustomerInfo(customer : Customer, message : any) : Promise<CustomerInfoSql>{
    const endpoint = `customers/bot/checkCustomer/${message.from}`
    const method = "POST"

    const response = await this.Api.Request<CheckCustomerPayload>({
      endpoint,
      method,
      body: {
        firstName: message.sender.shortName || message.sender.verifiedName || "Não identificado",
        id: customer._id
      }
    })

    return new CustomerInfoSql(response.data)
  }

  async SaveAddress(body : CustomerAddressSQL) : Promise<void> {
    const endpoint = `addresses`
    const method = "POST"

    const response = await this.Api.Request({
      endpoint,
      method,
      body
    })
  }
}