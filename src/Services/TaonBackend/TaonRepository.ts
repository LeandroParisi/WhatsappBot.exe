import { Service } from "typedi"
import { Message } from "venom-bot";
// import { Message } from "venom-bot";
import BranchData, { City, Country, State } from "../../../data/DTOs/BranchData";
import CustomerInfo from "../../../data/DTOs/CustomerInfo";
import LoginData from "../../../data/Interfaces/LoginData";
import { CustomMessage } from "../../../node_modules_extensions/MessageExtension";
import Customer from "../../../data/Models/Customer";
import CustomerAddress, { CustomerAddressSQL } from "../../../data/Models/CustomerAddress";
import { api } from "./services/api"
import { LocationsPayload } from "../../../data/DTOs/LocationsPayload";

@Service()
export default class TaonRepository {
  
  async Login(email : string, password : string) : Promise<LoginData> {
    const endpoint = "users/bot/login"
    const method = "POST"

    const response = await api({
      endpoint, 
      method,
      body: { email, password },
    })

    return response.data.data
  }

  async ValidateSession(token : string) : Promise<void> {
    const endpoint = "users/bot/sessionAuth"
    const method = "POST"

    await api({
      endpoint, 
      method,
      body: { token },
    })
  }

  async GetInitialData(token : string, whatsappNumber : string) : Promise<BranchData> {
    const endpoint = "branches/bot/initialLoad"
    const method = "GET"

    const response = await api({
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

    const response = await api({
      endpoint, 
      method,
    })

    return response.data.data
  }

  async CheckCustomerInfo(customer : Customer, message : any) : Promise<CustomerInfo>{
    const endpoint = `customers/bot/checkCustomer/${message.from}`
    const method = "POST"

    const response = await api({
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

    const response = await api({
      endpoint,
      method,
      body
    })

    return response.data.data
  }

}