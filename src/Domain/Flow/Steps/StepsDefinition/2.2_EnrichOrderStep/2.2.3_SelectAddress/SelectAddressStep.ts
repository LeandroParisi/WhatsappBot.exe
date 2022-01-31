import BranchData from "../../../../../../../data/Interfaces/BranchData"
import staticImplements from "../../../../../../Shared/Anotations/staticImplements"
import StepError from "../../../../../Abstractions/Errors/StepError"
import Customer from "../../../../../Models/Customer"
import Order from "../../../../../Models/Order"
import { ActionsEnum } from "../../../../StepActions/Interfaces/IActionHandler"
import ActionsUtils from "../../../../Utils/ActionsUtils"
import Validations from "../../../../Utils/Validations"
import IStep, { StepNumbers } from "../../../Interfaces/IStep"
import { ValidateParameters } from "../../../Interfaces/IValidatedStep"
import StepDefinition from "../../../Interfaces/StepDefinition"
import StepInfo from "../../../Messages/StepInfo"
import SelectAddress from "../../StepGenerators/SelectAddress"
import EnrichOrderStep from "../EnrichOrderStep"

export enum AddressPossibleAnswers {
  CADASTRAR = "CADASTRAR"
}

enum SelectedOption {
  selectAddress = "SELECT_ADDRESS",
  registerAddress = "REGISTER_ADDRESS",
}

interface ValidationPayload {
  selectedOption? : SelectedOption
  isValidAnswer : boolean
}

@staticImplements<IStep>()
export default class SelectAddressStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.selectAddress
  
  public async Interact() : Promise<StepInfo> {
    const { branchData } = this.SessionData

    const { isValidAnswer, selectedOption } = this.ValidateAnswer()

    if (!isValidAnswer) {
      return new StepInfo(
        [
          "Desculpe, esta opção não é válida.",
          "Vamos tentar novamente?",
          "Favor digitar o número do endereço de entrega:",
          this.Customer.customerTemplateMessages.addresses,
          `Ou, se quiser a entrega em outro endereço digite *${AddressPossibleAnswers.CADASTRAR}*.`
        ],
        StepNumbers.selectAddress
      )
    } else {
      return this.AnswerFactory(selectedOption)
    }
  }

  private AnswerFactory(selectedOption: SelectedOption): StepInfo {
      const formattedAnswer = Number(this.Answer.trim())
    
      switch(selectedOption) {
        case SelectedOption.registerAddress:
          return SelectAddress.GetRegisterStep(this.Customer)
        case SelectedOption.selectAddress:
          this.OrderInfo.addressId = this.Customer.info.customerAddresses[formattedAnswer - 1]._id
          
          const nextStep = EnrichOrderStep.ExtractMissingOrderInfo(this.OrderInfo, this.SessionData.branchData, this.Customer)

          return new StepInfo(
            nextStep.outboundMessages,
            nextStep.nextStep,
            [ActionsEnum.UPDATE_ORDER, ...ActionsUtils.ExtractActions(nextStep)],
            [this.OrderInfo, ...ActionsUtils.ExtractActionsPayload(nextStep)]
          )

        default:
          throw new StepError(SelectAddressStep.STEP_NUMBER, "Answers was validated, but it wasn't possible to determine which Step to send user based on his answer")
      }
  }

  private ValidateAnswer() : ValidationPayload {
    if (this.Answer.trim().toUpperCase() === AddressPossibleAnswers.CADASTRAR) {
      return {
        isValidAnswer: true,
        selectedOption: SelectedOption.registerAddress
      }
    }
    else if (Validations.IsInRange(this.Answer, this.Customer.info.customerAddresses)) {
      return {
        isValidAnswer: true,
        selectedOption: SelectedOption.selectAddress
      }
    }
    return {
      isValidAnswer: false
    }
  }
}