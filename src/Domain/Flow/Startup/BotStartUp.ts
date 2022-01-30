import { Service } from 'typedi';
import { Message } from 'venom-bot';
import BranchData from '../../../../data/Interfaces/BranchData';
import SessionHandler from '../../../Services/SessionManagement/SessionHandler';
import UserDataHandler from '../../../Services/UserData/UserDataHandler';
import Customer from '../../Models/Customer';
import IStep, { ADDRESS_STEPS, BUY_STEPS } from '../Steps/Interfaces/IStep';
import StepFactory from '../Steps/StepsDefinition/StepFactory/StepFactory';
import ActionsFactory from '../StepActions/ActionDefinitions/ActionsFactory/ActionsFactory';
import TaonHandler from '../../../Services/TaonBackend/TaonHandler';
import StepInfo from '../Steps/Messages/StepInfo';
import OrderRepository from '../../../Services/SessionManagement/OrderRepository';
import AddressesRepository from '../../../Services/SessionManagement/AddressesRepository';
import { ActionsEnum } from '../StepActions/Interfaces/IActionHandler';
import { StepDefinitionArgs } from '../Steps/Interfaces/StepDefinition';

interface SetupInfo {
  customer : Customer
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
    private readonly OrderRepository : OrderRepository,
    private readonly AddressesRepository : AddressesRepository
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

        await this.HandleStepAction(stepInfo, customer);
        
        await this.SessionHandler.UpdateClientStep(customer, stepInfo.nextStep)
        
        await this.SendMessages(stepInfo.outboundMessages, customer)
        
      } else {
        // No actions for messages received from groups
      }
    });
  }

  // TODO: Tirar daqui?
  public async ValidateUser(startupDate : Date) : Promise<void> {
    const userId = await this.UserDataHandler.ValidateUser();
    this.sessionData.startupDate = startupDate
    await this.UserDataHandler.SetStartupTime(userId, startupDate)
  }

  private async HandleMessage(inboundMessage: Message) : Promise<HandledMessage> {
    const { 
      customer, 
    } = await this.MessageSetup(inboundMessage)

    const stepPayload = await this.PayloadFactory(customer, inboundMessage)

    const stepHandler = StepFactory.Create(customer.currentStep, stepPayload)

    let stepInfo = null

    stepInfo = stepHandler.Interact()

    return {
      stepInfo,
      customer
    }
  }

  async PayloadFactory(customer : Customer, message : Message) : Promise<StepDefinitionArgs> {
    let orderInfo = null
    let address = null

    if (BUY_STEPS.has(customer.currentStep)) {
      orderInfo = await this.OrderRepository.GetClientOrders(customer._id)
    }

    if (ADDRESS_STEPS.has(customer.currentStep)) {
      address = await this.AddressesRepository.GetClientAddresses(customer._id)
    }

    return {
      customer,
      message,
      sessionData: { ...this.sessionData },
      orderInfo,
      address
    }
  }
  
  private async MessageSetup(inboundMessage: Message) : Promise<SetupInfo> {
    const customer = await this.SessionHandler.CheckIn(inboundMessage);

    const branchData = await this.UserDataHandler.UpdateTemplateMessages(customer.lastMessage, this.sessionData.branchData)   
    
    this.SetBranchData(branchData)

    return {
      customer,
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
      await this.bot.sendText(customer.info.whatsappId, outboundMessage)
    }
  }

  private async HandleStepAction(stepInfo: StepInfo, client: Customer) {
    console.log({ actions: stepInfo.requiredAction })
    
    if (stepInfo.requiredAction && !!stepInfo.requiredAction.length) {
      stepInfo.requiredAction.forEach(
        async (action : ActionsEnum, index : number) => {
          console.log({ action })
          const actionHandler = ActionsFactory.Create(action)
          await actionHandler
            .DispatchAction(stepInfo.actionPayload[index], client);
      })
    }
  }

  private IsValidMessage(inboundMessage: Message) {
    return !inboundMessage.isGroupMsg && inboundMessage.from === "553182630325@c.us"
  }

  private SetBranchData(branchData: BranchData) {
    this.sessionData.branchData = branchData
  }
}
