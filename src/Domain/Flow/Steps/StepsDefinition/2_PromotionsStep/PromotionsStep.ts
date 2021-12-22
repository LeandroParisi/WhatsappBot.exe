import { Message } from "venom-bot";
import BranchData, { PromotionsInformation } from "../../../../../data/Interfaces/BranchData";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Client from "../../../../Models/Client";
import IStep, { STEP_NUMBERS } from "../../Interfaces/IStep";
import MainMenu from "../10_MainMenu/MainMenu";
import StepInfo from "../../Messages/StepInfo";
import Validations from "../../../Utils/Validations";
import MessageUtils from "../../../../Utils/MessageUtils";
import PromotionsSelectionStep from "../DefaultSteps/PromotionsSelectionStep";
import ReturnToMenu from "../DefaultSteps/ReturnToMenu";
import OptionsStep from "../../Interfaces/OptionsStep";
import StepError from "../../../../Abstractions/Errors/StepError";


enum PossibleAnswers {
  back = "VOLTAR",
}

enum SelectedOption {
  buy = "BUY_PROMOTION",
  invalidPromotionNumber = "INVALID_PROMOTION_NUMBER",
  back = "VOLTAR"
}

@staticImplements<IStep>()
export default class PromotionsStep {
  static STEP_NUMBER = STEP_NUMBERS.promotionStep
  static STEP_NAME = "Selecionar promoção"
  
  static Interact(client: Client, message : Message, branchData : BranchData) : StepInfo {
    const clientAnswer = message.body
    
    const { isValid, selectedOption } = this.ValidateAnswer(
      clientAnswer,
      branchData.templateMessages.promotionsInformation.avaiablePromotions
    )

    if (isValid) {
      return this.AnswerFactory(selectedOption, branchData.templateMessages.promotionsInformation)
    } else {
      return PromotionsSelectionStep.GenerateMessage({ 
        prefixMessages: ['Desculpe, não entendi qual opção deseja.\nFavor tentar novamente.'],
        promotions: branchData.templateMessages.promotionsInformation.message
      })
    }
  }

  private static ValidateAnswer(
    answer : string,
    numberOfOptions : number
  ) : {
    isValid : boolean,
    selectedOption? : SelectedOption
  } {
    if (Validations.IsNumber(answer)) {
      const formattedAnswer = MessageUtils.FormatNumberOption(answer)
      const isValidNumber = formattedAnswer >= numberOfOptions && formattedAnswer <= numberOfOptions
      return { 
        isValid: true,
        selectedOption: isValidNumber 
          ? SelectedOption.buy 
          : SelectedOption.invalidPromotionNumber
        }
    } else if (answer.toUpperCase().trim() === PossibleAnswers.back) {
      return { isValid: true, selectedOption: SelectedOption.back }
    } else {
      return { isValid: false }
    }
  }

  private static AnswerFactory(selectedOption: SelectedOption, promotions: PromotionsInformation): StepInfo {
    switch (selectedOption) {
      case SelectedOption.buy:
        return new StepInfo(
          [
            'TODO: Implementar a compra direta de promoção'
          ],
          STEP_NUMBERS.mainMenu
        )
      case SelectedOption.invalidPromotionNumber:
        return PromotionsSelectionStep.GenerateMessage({ 
          promotions: promotions.message, 
          prefixMessages: ['Desculpe, não existe essa promoção, favor digitar um número válido.'] 
        })
      case SelectedOption.back:
        return ReturnToMenu.GenerateMessage({})
      default:
        throw new StepError(this.STEP_NUMBER, "Answers was validated, but it wasn't possible to determine which Step to send user based on his answer")
    }
  }
}