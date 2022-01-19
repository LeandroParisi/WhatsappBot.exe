import CustomerInfo from "../../../../../../data/Interfaces/CustomerInfo";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../Models/Customer";
import IStep, { StepNumbers } from "../../Interfaces/IStep";
import IStepInfo from "../../Messages/IStepInfo";
import StepInfo from "../../Messages/StepInfo";
import MainMenu from "../10_MainMenu/MainMenu";
import { AddressPossibleAnswers } from "../2.2_EnrichOrderStep/2.2.3_SelectAddress/SelectAddressStep";

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
    customer : Customer
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
        return this.GetRegisterStep()
      }
    }

  static GetRegisterStep() : StepInfo {
    return new StepInfo(
      [
        "Você não tem nenhum endereço cadastrado conosco.",
        "Que tal cadastrarmos um?",
      ],
      StepNumbers.registerAddress
    )
  }
} 