import CustomerInfo from "../../../../../../data/DTOs/CustomerInfo";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../../../data/Models/Customer";
import CustomerAddress, { AddressStatusEnum } from "../../../../../../data/Models/CustomerAddress";
import IStep, { StepNumbers } from "../../Interfaces/IStep";
import IStepInfo from "../../Messages/IStepInfo";
import StepInfo from "../../Messages/StepInfo";
import MainMenu from "../10_MainMenu/MainMenu";
import { AddressPossibleAnswers } from "../2.2_EnrichOrderStep/2.2.3_SelectAddress/SelectAddressStep";
import RegisterAddressStep from "../3_RegisterAddress/RegisterAddressStep";
import { SessionData } from "../../../Startup/BotCore";
import MemoryData from "../../../../../../data/DTOs/MemoryData/MemoryData";

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

    console.log(address)
    console.log(nextStep)


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