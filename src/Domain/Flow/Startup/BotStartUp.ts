import { Service } from 'typedi';
import { Message } from 'venom-bot';
import BranchData from '../../../data/Interfaces/BranchData';
import SessionHandler from '../../../Services/SessionManagement/SessionHandler';
import TaonRepository from '../../../Services/TaonBackend/TaonRepository';
import UserDataHandler from '../../../Services/UserData/UserDataHandler';
import DaysUtils from '../../../Shared/Utils/DaysUtils';
import Client from '../../Models/Client';
import MessageUtils from '../../Utils/MessageUtils';
import IStep from '../Steps/Interfaces/IStep';
import StepFactory from '../Steps/StepsDefinition/StepFactory/StepFactory';
import BranchDataDb from "../../../Services/UserData/config"

interface SetupInfo {
  client : Client
  stepHandler : IStep
}

@Service()
export default class BotStartup {
  private bot: any;
  private branchData: BranchData
  private startupDate: Date;

  constructor(
    private readonly SessionHandler : SessionHandler,
    private readonly TaonRepository : TaonRepository,
    private readonly UserDataHandler : UserDataHandler) {}

  public Start() {
    this.bot.onMessage(async (inboundMessage: Message) => {
      if (this.IsValidMessage(inboundMessage)) {
        const { client, stepHandler } = await this.MessageSetup(inboundMessage)

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
  
  private async MessageSetup(inboundMessage: Message) : Promise<SetupInfo> {
    const client = new Client(inboundMessage);

    const currentStep = await this.SessionHandler.CheckIn(client);
    
    await this.SessionHandler.UpdateTemplateMessages(client, this.startupDate)     
  
    const stepHandler = StepFactory.Create(currentStep)

    return {
      client,
      stepHandler
    }
  }

  public async InitialLoad() : Promise<void> {
    const userId = await this.UserDataHandler.ValidateUser();
    const startupDate = DaysUtils.GetDateFromTimestamp(Date.now() / 1000)
    this.startupDate = startupDate
    await this.UserDataHandler.SetStartupTime(userId, startupDate)
  }

  public async LoadUserInfo() {
    // TODO: tratamento erro
    const botInfo = await this.bot.getHostDevice(); 
    const { id: { user : deviceNumber } } = botInfo
    
    // const deviceNumber = "553175080415"
    const branchData = await this.UserDataHandler.LoadInitialData(deviceNumber);

    this.SetBranchData(branchData)
  }

  public SetBot(bot: any) {
    this.bot = bot
  }

  private IsValidMessage(inboundMessage: Message) {
    return !inboundMessage.isGroupMsg && inboundMessage.from === "5521993368575@c.us"
  }

  private SetBranchData(branchData: BranchData) {
    this.branchData = branchData
  }
}
