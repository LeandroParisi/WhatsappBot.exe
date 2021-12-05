import { Service } from 'typedi';
import { Message } from 'venom-bot';
import SessionHandler from '../../../Services/SessionManagement/SessionHandler';
import Client from '../../Models/Client';
import StepFactory from '../Steps/StepFactory/StepFactory';

@Service()
export default class BotStartup {
  bot: any;

  constructor(private readonly SessionHandler : SessionHandler) {}

  public Start() {
    this.bot.onMessage(async (inboundMessage: Message) => {
      if (this.IsValidMessage(inboundMessage)) {
        const client = new Client(inboundMessage);
        const currentStep = await this.SessionHandler.CheckIn(client);

        console.log({currentStep})

        const stepHandler = StepFactory.Create(currentStep)
        const stepInfo = stepHandler.Interact(client, inboundMessage)

        for (let outboundMessage of stepInfo.outboundMessages) {
          await this.bot.sendText(inboundMessage.from, outboundMessage)
        }

        await this.SessionHandler.UpdateClientStep(client, stepInfo.nextStep)

      } else {
        // No actions for messages received from groups
      }
    });
  }

  private IsValidMessage(inboundMessage: Message) {
    return !inboundMessage.isGroupMsg && inboundMessage.from === "5521993368575@c.us"
  }

  SetBot(bot: any) {
    this.bot = bot
  }
}
