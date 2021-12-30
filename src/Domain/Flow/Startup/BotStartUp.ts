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
import ActionsFactory from '../StepActions/ActionDefinitions/ActionsFactory/ActionsFactory';

interface SetupInfo {
  client : Client
  stepHandler : IStep
}

export interface SessionData {
  branchData : BranchData
  startupDate : Date
}

@Service()
export default class BotStartup {
  private bot: any;
  private sessionData : SessionData

  constructor(
    private readonly SessionHandler : SessionHandler,
    private readonly TaonRepository : TaonRepository,
    private readonly UserDataHandler : UserDataHandler) {
      this.sessionData = {
        branchData: null,
        startupDate: null
      }
    }

  public Start() {
    this.bot.onMessage(async (inboundMessage: Message) => {
      if (this.IsValidMessage(inboundMessage)) {
        const { client, stepHandler } = await this.MessageSetup(inboundMessage)

        const stepInfo = stepHandler.Interact(client, inboundMessage, { ...this.sessionData })

        for (let outboundMessage of stepInfo.outboundMessages) {
          await this.bot.sendText(client._id, outboundMessage)
        }

        if (stepInfo.requiredAction) {
          const action = ActionsFactory.Create(stepInfo.requiredAction)
          action.DispatchAction(stepInfo.actionPayload, client);
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
    
    const branchData = await this.UserDataHandler.UpdateTemplateMessages(client.lastMessage, this.sessionData.branchData)   
    
    this.SetBranchData(branchData)
  
    const stepHandler = StepFactory.Create(currentStep)

    return {
      client,
      stepHandler
    }
  }

  public async ValidateUser(startupDate : Date) : Promise<void> {
    const userId = await this.UserDataHandler.ValidateUser();
    this.sessionData.startupDate = startupDate
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
    this.sessionData.branchData = branchData
  }
}
