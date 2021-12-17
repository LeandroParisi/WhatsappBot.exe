import { Service } from "typedi"
import BranchData from "../../data/Interfaces/BranchData";
import LoginData from "../../data/Interfaces/LoginData";
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
}