import { Service } from "typedi"
// import { Message } from "venom-bot";
import BranchData, { City, Country, State } from "../../../data/DTOs/BranchData";
import CustomerInfo from "../../../data/DTOs/CustomerInfo";
import LoginData from "../../../data/Interfaces/LoginData";
import Customer from "../../../data/Models/Customer";
import CustomerAddress, { CustomerAddressSQL } from "../../../data/Models/CustomerAddress";
import { LocationsPayload } from "../../../data/DTOs/LocationsPayload";
import Api from "../Shared/api";
import Config from "../../config";

@Service()
export default class TaonRepository {
  private readonly Api : Api

  constructor() {
    this.Api = new Api(Config.backendUrl)
  }
  
  async Login(email : string, password : string) : Promise<LoginData> {
    const endpoint = "users/bot/login"
    const method = "POST"

    const response = await this.Api.Request({
      endpoint, 
      method,
      body: { email, password },
    })

    return response.data.data
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

    const response = await this.Api.Request({
      endpoint, 
      method,
      body: { whatsappNumber },
      headers: { auth: token }
    })

    return response.data.data
  }

  async GetLocations() : Promise<LocationsPayload> {
    const endpoint = "locations"
    const method = "GET"

    const response = await this.Api.Request({
      endpoint, 
      method,
    })

    return response.data.data
  }

  async CheckCustomerInfo(customer : Customer, message : any) : Promise<CustomerInfo>{
    const endpoint = `customers/bot/checkCustomer/${message.from}`
    const method = "POST"

    const response = await this.Api.Request({
      endpoint,
      method,
      body: {
        firstName: message.sender.shortName || message.sender.verifiedName || "Não identificado",
        id: customer._id
      }
    })

    return response.data.data
  }

  async SaveAddress(body : CustomerAddressSQL) : Promise<CustomerAddress> {
    const endpoint = `addresses`
    const method = "POST"

    const response = await this.Api.Request({
      endpoint,
      method,
      body
    })

    return response.data.data
  }

}