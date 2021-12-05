import readline = require('readline');
import { Service } from "typedi";
import TaonRepository from '../TaonBackend/TaonRepository';
import UserDataRepository from "./UserDataRepository";

@Service()
export default class UserDataHandler {
  constructor(
    private readonly repository : UserDataRepository,
    private readonly TaonRepository : TaonRepository
  ) {}

  async ValidateUser() : Promise<void> {
    // const {email, password} = this.GetUserInfo();
    // TODO: Capturar email e password do usuário


    const userData = await this.repository.GetLoginData();

    if (userData) {
      console.log("already saved Token")
      console.log({ userData })
      const data = await this.TaonRepository.ValidateSession(userData.email, userData.token)
      return
    } else {
      const email = "user@teste.com"
      const password = "123456"
  
      const data = await this.TaonRepository.Login(email, password)
  
      await this.repository.SaveLoginData(data);
    }

  }

  async LoadUserData() {
    const email = "user@teste.com"

  }

  GetUserInfo() {
    let email = ""
    let password = ""

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('What is your email? ', (answer) => {
      email = answer
      rl.close();
    });

    rl.question('What is your password? ', (answer) => {
      password = answer
      rl.close();
    });

    return {email, password}
  }

  // eslint-disable-next-line class-methods-use-this
  async ErrorCatcher(callback: () => any) {
    try {
      const result = await callback();
      return result;
    } catch (error) {
      // No need to treat error since it's already beeing treated
      // on config/database.onError event listener
      return null;
    }
  }
}
