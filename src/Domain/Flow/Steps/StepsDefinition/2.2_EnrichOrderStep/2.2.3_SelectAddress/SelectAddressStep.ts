import { Message } from "venom-bot"
import BranchData from "../../../../../../../data/Interfaces/BranchData"
import staticImplements from "../../../../../../Shared/Anotations/staticImplements"
import StepError from "../../../../../Abstractions/Errors/StepError"
import Customer from "../../../../../Models/Customer"
import Order from "../../../../../Models/Order"
import { SessionData } from "../../../../Startup/BotStartUp"
import OrderDTO from "../../../../StepActions/DTOs/OrderDTO"
import { ActionsEnum } from "../../../../StepActions/Interfaces/IActionHandler"
import Validations from "../../../../Utils/Validations"
import IStep, { StepInteractionPayload, StepNumbers } from "../../../Interfaces/IStep"
import IValidatedStep, { ValidateParameters } from "../../../Interfaces/IValidatedStep"
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
export default class SelectAddressStep {
  static STEP_NUMBER = StepNumbers.selectAddress
  
  static Interact({
    customer,
    message ,
    sessionData,
    orderInfo,
    } : StepInteractionPayload
    ) : StepInfo {
    const { branchData } = sessionData
    const answer = message.body

    const { isValidAnswer, selectedOption } = this.ValidateAnswer(
      { answer, sessionData, customer }
    )

    if (!isValidAnswer) {
      return new StepInfo(
        [
          "Desculpe, esta opção não é válida.",
          "Vamos tentar novamente?",
          "Favor digitar o número do endereço de entrega:",
          customer.customerTemplateMessages.addresses,
          `Ou, se quiser a entrega em outro endereço digite *${AddressPossibleAnswers.CADASTRAR}*.`
        ],
        StepNumbers.selectAddress
      )
    } else {
      return this.AnswerFactory(orderInfo, customer, answer, selectedOption, branchData)
    }
  }
  static AnswerFactory(
    orderInfo: Order,
    customer: Customer,
    answer: string,
    selectedOption: SelectedOption,
    branchData : BranchData
    ): StepInfo {
      const formattedAnswer = Number(answer.trim())
    
      switch(selectedOption) {
        case SelectedOption.registerAddress:
          return SelectAddress.GetRegisterStep()
        case SelectedOption.selectAddress:
          orderInfo.addressId = customer.info.customerAddresses[formattedAnswer - 1].id
          
          const nextStep = EnrichOrderStep.ExtractMissingOrderInfo(orderInfo, branchData, customer)

          return new StepInfo(
            nextStep.outboundMessages,
            nextStep.nextStep,
            ActionsEnum.UPDATE_ORDER,
            new OrderDTO(orderInfo)
          )

        default:
          throw new StepError(this.STEP_NUMBER, "Answers was validated, but it wasn't possible to determine which Step to send user based on his answer")
      }
  }

  static ValidateAnswer(
    {
      answer,
      sessionData,
      customer
    } : ValidateParameters
  ) : ValidationPayload {
    if (answer.trim().toUpperCase() === AddressPossibleAnswers.CADASTRAR) {
      return {
        isValidAnswer: true,
        selectedOption: SelectedOption.registerAddress
      }
    }
    else if (Validations.isInRange(answer, customer.info.customerAddresses)) {
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