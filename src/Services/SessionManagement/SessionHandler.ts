import { Service } from "typedi";
import { Message } from "venom-bot";
import Client from "../../Domain/Models/Client";
import DaysUtils from "../../Shared/Utils/DaysUtils";
import UserDataRepository from "../UserData/UserDataRepository";
import SessionRepository from './SessionRepository';

@Service()
export default class SessionHandler {
  constructor(
    private readonly repository : SessionRepository,
    private readonly UserDataRepository : UserDataRepository
  ) {
  }

  async CheckIn(client: Client) : Promise<number> {
    // TODO: Verificação da última data de checkin do cliente, se for muito velha resetar a sessão
    const foundClient = await this.repository.GetClientById(client._id);

    if (foundClient) {
      client.currentStep = foundClient.currentStep
      return foundClient.currentStep;
    }
    
    const insertedClient = await this.repository.InsertClient(client)

    return insertedClient.currentStep;
  }
  
  public async UpdateTemplateMessages(currentSession : Client, startupDate : Date) {
    const currentSessionTime = currentSession.lastMessage
    const daysDifference = DaysUtils.GetDatesDifferenceInDays(currentSessionTime, startupDate)
    // DOING
    if (daysDifference) {
      
    }

  }

  async UpdateClientStep(client : Client, nextStep : number) {
    await this.repository.UpdateClient(
      client, 
      { 
        currentStep: nextStep,
        lastMessage: client.lastMessage
      }
    )
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
