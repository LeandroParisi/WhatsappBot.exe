import { Service } from 'typedi';
import { Message } from 'venom-bot';
import BranchData from '../../../data/Interfaces/BranchData';
import SessionHandler from '../../../Services/SessionManagement/SessionHandler';
import TaonRepository from '../../../Services/TaonBackend/TaonRepository';
import UserDataHandler from '../../../Services/UserData/UserDataHandler';
import Client from '../../Models/Client';
import BranchDataUtils from '../../Utils/BranchDataUtils';
import StepFactory from '../Steps/StepsDefinition/StepFactory/StepFactory';

@Service()
export default class BotStartup {
  bot: any;
  branchData: BranchData

  constructor(
    private readonly SessionHandler : SessionHandler,
    private readonly TaonRepository : TaonRepository,
    private readonly UserDataHandler : UserDataHandler) {}

  public Start() {
    this.bot.onMessage(async (inboundMessage: Message) => {
      if (this.IsValidMessage(inboundMessage)) {
        const client = new Client(inboundMessage);
        const currentStep = await this.SessionHandler.CheckIn(client);

        console.log({currentStep})

        const stepHandler = StepFactory.Create(currentStep)
        const stepInfo = stepHandler.Interact(client, inboundMessage, this.branchData)

        // TODO: validação que o stepInfo voltou certo
        for (let outboundMessage of stepInfo.outboundMessages) {
          await this.bot.sendText(client._id, outboundMessage)
        }

        await this.SessionHandler.UpdateClientStep(client, stepInfo.nextStep)

      } else {
        // No actions for messages received from groups
      }
    });
  }

  public async LoadUserInfo() {
    // TODO: tratamento erro
    const botInfo = await this.bot.getHostDevice(); 
    const { id: { user : deviceNumber } } = botInfo
    
    // const deviceNumber = "553175080415"
    const branchData = await this.UserDataHandler.LoadInitialData(deviceNumber);

    this.SetBranchData(branchData)

    // console.log(BranchDataUtils.GeneratePromotionsMessage(branchData.promotions))
  }

  private IsValidMessage(inboundMessage: Message) {
    return !inboundMessage.isGroupMsg && inboundMessage.from === "5521993368575@c.us"
  }

  public SetBot(bot: any) {
    this.bot = bot
  }

  private SetBranchData(branchData: BranchData) {
    this.branchData = branchData
  }
}
