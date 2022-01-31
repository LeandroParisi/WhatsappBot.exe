import { Service } from "typedi";
import { Message } from "venom-bot";
import Config from "../../../config";
import CustomerInfo from "../../../../data/Interfaces/CustomerInfo";
import CustomerTemplateMessages from "../../../../data/Interfaces/CustomerTemplateMessages";
import Customer from "../../../Domain/Models/Customer";
import CustomerTemplateMessagesFactory from "../../../Domain/MessageFactories/CustomerTemplateMessagesFactory";
import DaysUtils from "../../../Shared/Utils/DaysUtils";
import TaonRepository from "../../TaonBackend/TaonRepository";
import CustomerRepository from '../Repositories/CustomerRepository';
import OrderRepository from "../Repositories/OrderRepository";
import AddressesRepository from "../Repositories/AddressesRepository";

@Service()
export default class SessionHandler {
  constructor(
    private readonly CustomerRepository : CustomerRepository,
    private readonly TaonRepository : TaonRepository,
    private readonly OrderRepository : OrderRepository,
    private readonly AddressesRepository : AddressesRepository
  ) {
  }

  async CheckIn(message: Message) : Promise<Customer> {
    const foundCustomer = await this.CustomerRepository.GetClientByNumber(message.from);

    if (foundCustomer) return foundCustomer;

    const customer = new Customer(message);

    const customerInfo = await this.TaonRepository.CheckCustomerInfo(customer, message)

    customer._id = customerInfo.id
    delete customerInfo.id
    customer.info = customerInfo

    customer.customerTemplateMessages = this.GenerateTemplateMessages(customer.info)

    await this.CustomerRepository.InsertCustomer(customer)

    return customer;
  }

  private GenerateTemplateMessages(customerInfo : CustomerInfo): CustomerTemplateMessages {
    var addresses = CustomerTemplateMessagesFactory.GenerateAddressMessage(customerInfo.customerAddresses)
    
    return {
      addresses
    }
  }

  async UpdateClientStep(client : Customer, nextStep : number) {
    await this.CustomerRepository.UpdateClient(
      client, 
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
        { currentStep: { $in: sessionResetRules.currentStep } },
        { lastMessage: { $lte: lastMessageLimit } }
      ]
    }

    const invalidSessions = await this.CustomerRepository.FindAll(findQuery);

    const deleteQuery = {
      _id: { $in: invalidSessions.map((client : Customer) => client._id)}
    }

    await this.OrderRepository.CleanUp();
    await this.AddressesRepository.CleanUp();
    await this.CustomerRepository.DeleteClient(deleteQuery)
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
