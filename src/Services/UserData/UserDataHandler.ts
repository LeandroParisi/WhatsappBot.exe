import readline = require('readline');
import { Service } from "typedi";
import MaxLoginReached from '../Abstractions/Errors/MaxLoginReached';
import BackendError from '../Abstractions/Errors/BackendError';
import TaonRepository from '../TaonBackend/TaonRepository';
import UserDataRepository from "./UserDataRepository";
import BranchData from '../../data/Interfaces/BranchData';
import TemplateMessagesGenerator from '../../Domain/Utils/TemplateMessagesGenerator';
import DaysUtils from '../../Shared/Utils/DaysUtils';
import SessionRepository from '../SessionManagement/SessionRepository';

@Service()
export default class UserDataHandler {
  loginRetries : number

  constructor(
    private readonly repository : UserDataRepository,
    private readonly TaonRepository : TaonRepository
  ) {
    this.loginRetries = 0
  }

  async ValidateUser() : Promise<string> {
    const userData = await this.repository.GetLoginData();

    try {
      if (userData) {
        await this.TaonRepository.ValidateSession(userData.token)
        return userData._id
      } else {
        const { email, password } = this.GetUserInfo()
    
        const data = await this.TaonRepository.Login(email, password)
    
        const insertedId = await this.repository.SaveLoginData(data);
        return insertedId
      }
    } catch (error) {
      if (this.loginRetries >= 3) {
        throw new MaxLoginReached("Max login retries reached, try logging in again", error)
      }
      if (this.IsBackendError(error)) {
        await this.repository.DestroySessionData();
        this.loginRetries += 1
        // TODO adicionar mensagem de retry no console
        await this.ValidateUser();
      } else {
        throw error
      }
    }
  }

  async SetStartupTime(userId : string, lastStartup : Date) {
    await this.repository.UpdateUserData(
      { _id: userId },
      { lastStartup }
    )
  }

  async LoadInitialData(deviceNumber : string) : Promise<BranchData> {
    const userData = await this.repository.GetLoginData();

    // TODO: Tentar tratar este erro, o catch não funcionou aqui para jogar para o handler global do index    
    const data = await this.TaonRepository.GetInitialData(userData.token, deviceNumber)
    
    const branchData = await this.GenerateTemplateMessages(data)
    
    await this.repository.SaveUserData(branchData)

    return branchData
  }

  private GetUserInfo() {
    // TODO: Capturar email e password do usuário

    const email = "user@teste.com"
    const password = "123456"

    return { email, password }

  }

  private IsBackendError(error : BackendError) {
    return error?.status === 401
  }

  private async GenerateTemplateMessages(data : BranchData) : Promise<BranchData> {
    const { lastStartup } = await this.repository.GetLoginData()

    const branchData = {
      ...data,
      templateMessages: {
        promotionsInformation: TemplateMessagesGenerator.GeneratePromotionsMessage(data.promotions, lastStartup),
        openingHours: TemplateMessagesGenerator.GenerateOpeningHoursMessage(data.openingHours),
        deliveryInformation: TemplateMessagesGenerator.GenerateDeliveryInformationMessage(
          data.deliveryTypes,
          data.deliveryFees
        ),
        paymentMethods: TemplateMessagesGenerator.GeneratePaymentMethodsMessage(data.paymentMethods)
      }
    }

    return branchData
  }

  // GetUserInfo() {
  //   let email = ""
  //   let password = ""

  //   const rl = readline.createInterface({
  //     input: process.stdin,
  //     output: process.stdout
  //   });
    
  //   rl.question('What is your email? ', (answer) => {
  //     email = answer
  //     rl.close();
  //   });

  //   rl.question('What is your password? ', (answer) => {
  //     password = answer
  //     rl.close();
  //   });

  //   return {email, password}
  // }

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
