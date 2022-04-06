/* eslint-disable @typescript-eslint/no-var-requires */
import { Service } from 'typedi'
import { Message } from 'venom-bot'
import BranchData from '../../../Data/DTOs/BranchData'
import SessionHandler from '../../../Services/SessionManagement/Handlers/SessionHandler'
import UserDataHandler from '../../../Services/UserData/Handlers/UserDataHandler'
import StepFactory from '../Steps/StepsDefinition/StepFactory/StepFactory'
import ActionsFactory from '../StepActions/ActionDefinitions/ActionsFactory/ActionsFactory'
import TaonHandler from '../../../Services/TaonBackend/TaonHandler'
import StepInfo from '../Steps/Messages/StepInfo'
import OrderRepository from '../../../Services/SessionManagement/Repositories/OrderRepository'
import AddressesRepository from '../../../Services/SessionManagement/Repositories/AddressesRepository'
import StepDefinition from '../Steps/Interfaces/StepDefinition'
import MemoryData from '../../../Data/DTOs/MemoryData/MemoryData'
import {Whatsapp} from 'venom-bot'
import Customer from '../../../Data/Models/Customer'

require('dotenv').config()

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
  inMemoryData : MemoryData
}

@Service()
export default class BotCore {
  private bot: Whatsapp;
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
        startupDate: null,
        inMemoryData: null,
      }
    }

  public Start() {
    this.bot.onMessage(async (inboundMessage: Message) => {
      if (this.IsValidMessage(inboundMessage)) {
        const { stepInfo, customer } = await this.HandleMessage(inboundMessage)

        if (stepInfo.nextStep) await this.SessionHandler.UpdateClientStep(customer, stepInfo.nextStep)

        await this.SendMessages(stepInfo.outboundMessages, customer)
        
        await this.HandleStepAction(stepInfo, customer)
      } else {
        // No actions for messages received from groups
      }
    })
  }

  private async HandleMessage(inboundMessage: Message) : Promise<HandledMessage> {
    const { 
      customer, 
    } = await this.MessageSetup(inboundMessage)

    const stepHandler = StepFactory.Create(customer.currentStep, {
      customer,
      message: inboundMessage,
      sessionData: { ...this.sessionData },
    })

    await this.EnrichStepHandler(stepHandler, customer)

    const stepInfo = await stepHandler.Interact()

    return {
      stepInfo,
      customer
    }
  }

  async EnrichStepHandler(stepHandler: StepDefinition, customer: Customer) : Promise<void> {
    let orderInfo = null
    let address = null

    if (stepHandler.ORDER_STEP) {
      orderInfo = await this.OrderRepository.GetClientOrders(customer._id)
    }

    if (stepHandler.ADDRESS_STEP) {
      address = await this.AddressesRepository.GetClientAddresses(customer._id)
    }

    console.log("\nINICIO DO FLUXO")
    console.log({orderInfo})
    console.log({address})
    console.log('\n\n')


    stepHandler.Address = address
    stepHandler.OrderInfo = orderInfo
  }

  private async MessageSetup(inboundMessage: Message) : Promise<SetupInfo> {
    const customer = await this.SessionHandler.CheckIn(inboundMessage)

    const branchData = await this.UserDataHandler.UpdateTemplateMessages(
      customer.lastMessage, this.sessionData.branchData
    )   
    
    this.SetBranchData(branchData)

    return {
      customer,
    }
  }

  private async SendMessages(outboundMessages : string[], customer : Customer) {
    for (const outboundMessage of outboundMessages) {
      await this.bot.sendText(customer.info.whatsappId, outboundMessage)
    }
  }

  private async HandleStepAction(stepInfo: StepInfo, customer: Customer) {
    if (stepInfo.requiredAction && !!stepInfo.requiredAction.length) {
      for (let index = 0; index <= stepInfo.requiredAction.length - 1; index += 1) {
        const action = stepInfo.requiredAction[index]
        const actionHandler = ActionsFactory.Create(action)
        const postActionStep = await actionHandler
          .DispatchAction(stepInfo.actionPayload[index], customer, this.sessionData)

        if (postActionStep) {
          if (postActionStep.nextStep) await this.SessionHandler.UpdateClientStep(customer, postActionStep.nextStep)
          await this.SendMessages(postActionStep.outboundMessages, customer)
          await this.HandleStepAction(postActionStep, customer)
        }
      }
    }
  }

  private IsValidMessage(inboundMessage: Message) {
    if (process.env.TEST_WHATAPP_NUMBER) {
      return !inboundMessage.isGroupMsg && inboundMessage.from === process.env.TEST_WHATAPP_NUMBER
    }
    return !inboundMessage.isGroupMsg
  }

  public SetBot(bot: any) {
    this.bot = bot
  }

  public SetBranchData(branchData: BranchData) {
    this.sessionData.branchData = branchData
  }

  public SetStartupDate(startupDate: Date) {
    this.sessionData.startupDate = startupDate
  }

  public SetMemoryData(data: MemoryData) {
    this.sessionData.inMemoryData = data
  }
}
