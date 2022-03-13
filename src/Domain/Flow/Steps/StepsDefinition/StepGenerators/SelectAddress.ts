import Customer from "../../../../../Data/Models/Customer"
import CustomerAddress, { AddressStatusEnum } from "../../../../../Data/Models/CustomerAddress"
import { StepNumbers } from "../../Interfaces/IStep"
import StepInfo from "../../Messages/StepInfo"
import { AddressPossibleAnswers } from "../3.2_EnrichOrderStep/3.2.3_SelectAddress/SelectAddressStep"
import RegisterAddressStep from "../4_RegisterAddress/RegisterAddressStep"
import { SessionData } from "../../../Startup/BotCore"
import MemoryData from "../../../../../Data/DTOs/MemoryData/MemoryData"

interface options {
  prefixMessages? : string[],
  sufixMessages? : string[]
}
export default class SelectAddress {
  static GenerateMessage(
    { 
      prefixMessages = [],
      sufixMessages = [] 
    } : options,
    customer : Customer,
    sessionData : SessionData
    ) : StepInfo {

      if (customer.info.customerAddresses.length) {
        return new StepInfo(
          [
            "Precisamos preencher alguns dados de seu pedido.",
            "Favor digitar o número do endereço de entrega:",
            customer.customerTemplateMessages.addresses,
            `Ou, se quiser a entrega em outro endereço digite *${AddressPossibleAnswers.CADASTRAR}*.`
          ],
          StepNumbers.selectAddress
        )
      } else {
        return this.GetRegisterStep(customer, sessionData.inMemoryData)
      }
    }

  static GetRegisterStep (
      customer : Customer,
      memoryData : MemoryData, 
      options?: options
    ) : StepInfo {
    const address = new CustomerAddress(AddressStatusEnum.REGISTERING, customer._id)
    const nextStep = RegisterAddressStep.ExtractMissingAddressInfo(address, memoryData)



    const prefixMessages = options 
      ? options.prefixMessages 
      : [
        "Você não tem nenhum endereço cadastrado conosco.",
        "Que tal cadastrarmos um?"
      ]

    return new StepInfo(
      [
        ...prefixMessages,
        ...nextStep.outboundMessages
      ],
      nextStep.nextStep,
      nextStep.requiredAction,
      nextStep.actionPayload
    )
  }
} 