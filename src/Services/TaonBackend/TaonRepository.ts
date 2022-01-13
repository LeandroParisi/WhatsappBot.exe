import { Service } from "typedi"
import { Message } from "venom-bot";
import BranchData from "../../../data/Interfaces/BranchData";
import CustomerInfo from "../../../data/Interfaces/CustomerInfo";
import LoginData from "../../../data/Interfaces/LoginData";
import Customer from "../../Domain/Models/Customer";
import { api } from "./services/api"

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

  async CheckCustomerInfo(customer : Customer, message : Message) : Promise<CustomerInfo>{
    const endpoint = `customers/bot/checkCustomer/${customer._id}`
    const method = "POST"

    const response = await api({
      endpoint,
      method,
      body: {
        firstName: message.sender.shortName
      }
    })

    return response.data.data
  }

}