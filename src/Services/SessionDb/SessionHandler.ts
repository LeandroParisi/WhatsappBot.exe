import { Service } from "typedi";
import SessionRepository from './SessionRepository';

@Service()
export default class SessionHandler {
  constructor(private readonly repository : SessionRepository) {
  }

  async CheckIn(client) {
    const { hasOpenedSession, currentSession} = await this.repository.GetClientCurrentStep(client.id);
    return currentSession
  }

  // eslint-disable-next-line class-methods-use-this
  async ErrorCatcher(callback) {
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
