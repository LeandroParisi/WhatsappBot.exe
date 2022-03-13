import { Service } from "typedi"
import { Message } from "venom-bot"
import Config from "../../../config"
import CustomerTemplateMessages from "../../../Data/DTOs/CustomerTemplateMessages"
import CustomerTemplateMessagesFactory from "../../../Domain/MessageFactories/CustomerTemplateMessagesFactory"
import DaysUtils from "../../../Shared/Utils/DaysUtils"
import TaonRepository from "../../TaonBackend/TaonRepository"
import CustomerRepository from '../Repositories/CustomerRepository'
import { CustomerInfoSql } from "../../../Data/DTOs/CustomerInfo"
import Customer from "../../../Data/Models/Customer"
import CustomerAddress from "../../../Data/Models/CustomerAddress"

@Service()
export default class SessionHandler {
  constructor(
    private readonly CustomerRepository : CustomerRepository,
    private readonly TaonRepository : TaonRepository,
  ) {
  }

  async CheckIn(message: Message) : Promise<Customer> {
    const foundCustomer = await this.CustomerRepository.GetClientByNumber(message.from)

    if (foundCustomer) return foundCustomer

    const customer = new Customer(message)

    const response = await this.TaonRepository.CheckCustomerInfo(customer, message)

    const customerInfo = new CustomerInfoSql(response.customerInfo)

    customer._id = customerInfo.id
    customer.hasOrders = response.information.hasOrders
    customer.info = customerInfo.MapToMongo()

    customer.customerTemplateMessages = SessionHandler.GenerateTemplateMessages(customer.info.customerAddresses)

    await this.CustomerRepository.InsertCustomer(customer)

    return customer
  }

  static GenerateTemplateMessages(customerAddresses : Array<CustomerAddress>): CustomerTemplateMessages {
    const addresses = CustomerTemplateMessagesFactory.GenerateAddressMessage(customerAddresses)
    
    return {
      addresses
    }
  }

  async UpdateClientStep(client : Customer, nextStep : number) {
    await this.CustomerRepository.UpdateClient(
      client._id, 
      { 
        currentStep: nextStep,
        lastMessage: client.lastMessage
      }
    )
  }

  async ValidateCurrentSessions(startupDate : Date) : Promise<void> {
    const { sessionResetRules } = Config

    const lastMessageLimit = DaysUtils.SubtractTimeFromDate(
      startupDate, sessionResetRules.lastMessageInHours
    )

    const findQuery = {
      $or: [
        { currentStep: { $in: sessionResetRules.stepsToReset } },
        { lastMessage: { $lte: lastMessageLimit } }
      ]
    }

    const invalidSessions = await this.CustomerRepository.FindAll(findQuery)

    const deleteQuery = {
      _id: { $in: invalidSessions.map((client : Customer) => client._id)}
    }


    await this.CustomerRepository.DeleteClient(deleteQuery)
  }

  // eslint-disable-next-line class-methods-use-this
  async ErrorCatcher(callback: () => any) {
    try {
      const result = await callback()
      return result
    } catch (error) {
      // No need to treat error since it's already beeing treated
      // on config/database.onError event listener
      return null
    }
  }
}
