import { Service } from "typedi";
import { Message } from "venom-bot";
import Config from "../../config";
import Client from "../../Domain/Models/Client";
import DaysUtils from "../../Shared/Utils/DaysUtils";
import UserDataRepository from "../UserData/UserDataRepository";
import SessionRepository from './SessionRepository';

@Service()
export default class SessionHandler {
  constructor(
    private readonly repository : SessionRepository,
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

  async UpdateClientStep(client : Client, nextStep : number) {
    await this.repository.UpdateClient(
      client, 
      { 
        currentStep: nextStep,
        lastMessage: client.lastMessage
      }
    )
  }

  async ValidateCurrentSessions(startupDate : Date) : Promise<void> {
    const lastMessageLimit = DaysUtils.SubtractTimeFromDate(
      startupDate, Config.sessionResetRules.lastMessageInHours
    )

    const findQuery = {
      $or: [
        { currentStep: { $in: Config.sessionResetRules.currenStep } },
        { lastMessage: { $lte: lastMessageLimit } }
      ]
    }

    const invalidSessions = await this.repository.FindAll(findQuery);

    const deleteQuery = {
      _id: { $in: invalidSessions.map((client : Client) => client._id)}
    }

    await this.repository.DeleteClient(deleteQuery)
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
