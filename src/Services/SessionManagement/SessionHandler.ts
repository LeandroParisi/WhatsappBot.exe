import { Service } from "typedi";
import Client from "../../Domain/Models/Client";
import SessionRepository from './SessionRepository';

@Service()
export default class SessionHandler {
  constructor(private readonly repository : SessionRepository) {
  }

  async CheckIn(client: Client) : Promise<number> {
    const foundClient = await this.repository.GetClientById(client._id);
    console.log({foundClient})

    if (foundClient) {
      client.currentStep = foundClient.currentStep     
      return foundClient.currentStep;
    }
    
    const insertedClient = await this.repository.InsertClient(client)

    return insertedClient.currentStep;
  }

  async UpdateClientStep(client : Client, nextStep : number) {
    client.currentStep = nextStep
    await this.repository.UpdateClient(client, { currentStep: nextStep })
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
