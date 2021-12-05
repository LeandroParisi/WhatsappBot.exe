import { Service } from "typedi"
import LoginData from "../../Domain/Models/LoginData";
import api from "./services/api"

@Service()
export default class TaonRepository {
  
  async Login(email : string, password : string) : Promise<LoginData> {
    console.log("LOGIN")
    const endpoint = "users/bot/login"
    const method = "POST"

    const response = await api({
      endpoint, 
      method,
      body: { email, password },
    })

    return response.data.data
  }

  async ValidateSession(email : string, token : string) : Promise<void> {
    const endpoint = "users/bot/sessionAuth"
    const method = "POST"

    await api({
      endpoint, 
      method,
      body: { email, token },
    })
  }
}