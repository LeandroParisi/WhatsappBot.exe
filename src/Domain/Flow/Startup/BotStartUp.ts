import { Service } from 'typedi';
import { Message } from 'venom-bot';
import BranchData from '../../../../data/Interfaces/BranchData';
import SessionHandler from '../../../Services/SessionManagement/SessionHandler';
import TaonRepository from '../../../Services/TaonBackend/TaonRepository';
import UserDataHandler from '../../../Services/UserData/UserDataHandler';
import DaysUtils from '../../../Shared/Utils/DaysUtils';
import Customer from '../../Models/Customer';
import MessageUtils from '../../Utils/MessageUtils';
import IStep, { BUY_STEPS, StepInteractionPayload } from '../Steps/Interfaces/IStep';
import StepFactory from '../Steps/StepsDefinition/StepFactory/StepFactory';
import BranchDataDb from "../../../Services/UserData/config"
import ActionsFactory from '../StepActions/ActionDefinitions/ActionsFactory/ActionsFactory';
import TaonHandler from '../../../Services/TaonBackend/TaonHandler';
import StepInfo from '../Steps/Messages/StepInfo';
import Order from '../../Models/Order';
import OrderRepository from '../../../Services/SessionManagement/OrderRepository';

interface SetupInfo {
  customer : Customer
  stepHandler : IStep
}

interface HandledMessage {
  stepInfo : StepInfo
  customer : Customer
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
    private readonly TaonHandler : TaonHandler,
    private readonly UserDataHandler : UserDataHandler,
    private readonly OrderRepository : OrderRepository
    ) {
      this.sessionData = {
        branchData: null,
        startupDate: null
      }
    }

  public Start() {
    this.bot.onMessage(async (inboundMessage: Message) => {
      if (this.IsValidMessage(inboundMessage)) {
        const { stepInfo, customer } = await this.HandleMessage(inboundMessage)

        await this.SendMessages(stepInfo.outboundMessages, customer)

        await this.HandleStepAction(stepInfo, customer);

        await this.SessionHandler.UpdateClientStep(customer, stepInfo.nextStep)

      } else {
        // No actions for messages received from groups
      }
    });
  }

  // TODO: TIrar daqui?
  public async ValidateUser(startupDate : Date) : Promise<void> {
    const userId = await this.UserDataHandler.ValidateUser();
    this.sessionData.startupDate = startupDate
    await this.UserDataHandler.SetStartupTime(userId, startupDate)
  }

  private async HandleMessage(inboundMessage: Message) : Promise<HandledMessage> {
    const { 
      customer, 
      stepHandler, 
    } = await this.MessageSetup(inboundMessage)

    const stepPayload = await this.PayloadFactory(customer, inboundMessage)

    let stepInfo = null

    console.log("CHamar Step")

    stepInfo = stepHandler.Interact(stepPayload)

    return {
      stepInfo,
      customer
    }
  }

  async PayloadFactory(customer : Customer, message : Message) : Promise<StepInteractionPayload> {
    let orderInfo = null

    if (BUY_STEPS.has(customer.currentStep)) {
      orderInfo = await this.OrderRepository.GetClientOrders(customer._id)
    }

    return {
      customer,
      message,
      sessionData: { ...this.sessionData },
      orderInfo
    }
  }
  
  private async MessageSetup(inboundMessage: Message) : Promise<SetupInfo> {
    const customer = await this.SessionHandler.CheckIn(inboundMessage);

    const branchData = await this.UserDataHandler.UpdateTemplateMessages(customer.lastMessage, this.sessionData.branchData)   
    
    this.SetBranchData(branchData)
  
    const stepHandler = StepFactory.Create(customer.currentStep)

    return {
      customer,
      stepHandler,
    }
  }

  public async LoadUserInfo() {
    // TODO: tratamento erro
    const botInfo = await this.bot.getHostDevice(); 
    const { id: { user : deviceNumber } } = botInfo
    
    const branchData = await this.UserDataHandler.LoadInitialData(deviceNumber);

    this.SetBranchData(branchData)
  }

  public SetBot(bot: any) {
    this.bot = bot
  }

  private async SendMessages(outboundMessages : string[], customer : Customer) {
    for (let outboundMessage of outboundMessages) {
      await this.bot.sendText(customer._id, outboundMessage)
    }
  }

  private async HandleStepAction(stepInfo: StepInfo, client: Customer) {
    if (stepInfo.requiredAction) {
      const actionHandler = ActionsFactory.Create(stepInfo.requiredAction)
      await actionHandler.DispatchAction(stepInfo.actionPayload, client);
    }
  }

  private IsValidMessage(inboundMessage: Message) {
    return !inboundMessage.isGroupMsg && inboundMessage.from === "553182630325@c.us"
  }

  private SetBranchData(branchData: BranchData) {
    this.sessionData.branchData = branchData
  }
}
