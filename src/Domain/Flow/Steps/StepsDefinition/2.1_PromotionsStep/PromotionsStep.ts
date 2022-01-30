import { Message } from "venom-bot";
import BranchData, { Promotion, PromotionsInformation } from "../../../../../../data/Interfaces/BranchData";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import { ValidateParameters } from '../../Interfaces/IValidatedStep'
import Customer from "../../../../Models/Customer";
import IStep, { StepNumbers } from "../../Interfaces/IStep";
import StepInfo from "../../Messages/StepInfo";
import Validations from "../../../Utils/Validations";
import MessageUtils from "../../../../MessageFactories/AddressMessageFactory";
import PromotionsSelectionStep from "../StepGenerators/PromotionsSelectionStep";
import ReturnToMenu from "../StepGenerators/ReturnToMenu";
import StepError from "../../../../Abstractions/Errors/StepError";
import { SessionData } from "../../../Startup/BotCore";
import DaysUtils from "../../../../../Shared/Utils/DaysUtils";
import { ActionsEnum } from "../../../StepActions/Interfaces/IActionHandler";
import IValidatedStep from "../../Interfaces/IValidatedStep";
import Order from "../../../../Models/Order";
import { OrderStatusEnum } from "../../../../../../data/Interfaces/IOrderInfo";
import StepDefinition from "../../Interfaces/StepDefinition";
import EnrichOrderStep from "../2.2_EnrichOrderStep/EnrichOrderStep";

enum PossibleAnswers {
  back = "VOLTAR",
}

interface ValidationPayload {
  isValid : boolean,
  selectedOption? : SelectedOption
}

enum SelectedOption {
  buy = "BUY_PROMOTION",
  invalidPromotionNumber = "INVALID_PROMOTION_NUMBER",
  back = "VOLTAR",
  outdatedOptions = "OUTDATED_OPTIONS"
}

@staticImplements<IStep>()
export default class PromotionsStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.promotionStep
  
  public Interact() : StepInfo {
    const { branchData } = this.SessionData
    
    const { isValid, selectedOption } = this.ValidateAnswer()

    if (isValid) {
      return this.AnswerFactory(selectedOption)
    } else {
      return PromotionsSelectionStep.GenerateMessage({ 
        prefixMessages: ['Desculpe, não entendi qual opção deseja.\nFavor tentar novamente.'],
        promotions: branchData.templateMessages.promotionsInformation.message
      })
    }
  }

  private ValidateAnswer() : ValidationPayload {
    const { branchData, startupDate } = this.SessionData
    const numberOfOptions = branchData.avaiablePromotions.length
    const daysDifference = DaysUtils.GetDatesDifferenceInDays(this.Customer.lastMessage, startupDate)

    if (daysDifference) {
      return {
        isValid: true,
        selectedOption: SelectedOption.outdatedOptions,
      }
    } else if (Validations.IsNumber(this.Answer)) {
        const formattedAnswer = MessageUtils.FormatNumberOption(this.Answer)
        const isValidNumber = formattedAnswer >= numberOfOptions && formattedAnswer <= numberOfOptions
        return { 
          isValid: true,
          selectedOption: isValidNumber 
            ? SelectedOption.buy 
            : SelectedOption.invalidPromotionNumber,
        }
    } else if (this.Answer.toUpperCase().trim() === PossibleAnswers.back) {
        return { isValid: true, selectedOption: SelectedOption.back }
    } else {
        return { isValid: false }
    }
  }

  private AnswerFactory(selectedOption: SelectedOption): StepInfo {
    const formattedAnswer = MessageUtils.FormatNumberOption(this.Answer)
    const { branchData } = this.SessionData

    switch (selectedOption) {
      case SelectedOption.buy:
        const order = new Order(
          this.Customer._id,
          branchData.id,
          branchData.avaiablePromotions[formattedAnswer - 1].id,
          OrderStatusEnum.REGISTERING
        )

        const nextStep = EnrichOrderStep.ExtractMissingOrderInfo(order, branchData, this.Customer)

        return new StepInfo(
          [
            ...nextStep.outboundMessages
          ],
          nextStep.nextStep,
          [ActionsEnum.REGISTER_ORDER],
          [order]
        )

      case SelectedOption.invalidPromotionNumber:
        return PromotionsSelectionStep.GenerateMessage({ 
          promotions: branchData.templateMessages.promotionsInformation.message, 
          prefixMessages: ['Desculpe, não existe essa promoção, favor digitar um número válido.'] 
        })

      case SelectedOption.back:
        return ReturnToMenu.GenerateMessage({})

      case SelectedOption.outdatedOptions:
        return PromotionsSelectionStep.GenerateMessage({
          promotions: branchData.templateMessages.promotionsInformation.message, 
          prefixMessages: ['Opa, já passou da meia noite!! As promoções que te apresentei anteriormente eram de ontem, vou te mandar a nova lista para você escolher, tudo bem?'] 
        })

      default:
        throw new StepError(PromotionsStep.STEP_NUMBER, "Answers was validated, but it wasn't possible to determine which Step to send user based on his answer")
    }
  }
}