import { Message } from "venom-bot";
import BranchData, { Promotion, PromotionsInformation } from "../../../../../data/Interfaces/BranchData";
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
import { SessionData } from "../../../Startup/BotStartUp";
import DaysUtils from "../../../../../Shared/Utils/DaysUtils";
import { StepActionEnum } from "../../../StepActions/Interfaces/IStepAction";
import { BuyPromotionPayload } from "../../../StepActions/DTOs/BuyPromotionPayload";

enum PossibleAnswers {
  back = "VOLTAR",
}

enum SelectedOption {
  buy = "BUY_PROMOTION",
  invalidPromotionNumber = "INVALID_PROMOTION_NUMBER",
  back = "VOLTAR",
  outdatedOptions = "OUTDATED_OPTIONS"
}

@staticImplements<IStep>()
export default class PromotionsStep {
  static STEP_NUMBER = STEP_NUMBERS.promotionStep
  static STEP_NAME = "Selecionar promoção"
  
  static Interact(client: Client, message : Message, sessionData : SessionData) : StepInfo {
    const clientAnswer = message.body
    const { branchData, startupDate } = sessionData
    
    const { isValid, selectedOption, formattedAnswer } = this.ValidateAnswer(
      clientAnswer,
      sessionData,
      client
    )

    if (isValid) {
      return this.AnswerFactory(
        selectedOption,
        branchData,
        formattedAnswer
      )
    } else {
      return PromotionsSelectionStep.GenerateMessage({ 
        prefixMessages: ['Desculpe, não entendi qual opção deseja.\nFavor tentar novamente.'],
        promotions: branchData.templateMessages.promotionsInformation.message
      })
    }
  }

  private static ValidateAnswer(
    answer : string,
    { branchData, startupDate } : SessionData,
    client : Client,
  ) : {
    isValid : boolean,
    selectedOption? : SelectedOption
    formattedAnswer? : number
  } {
    const numberOfOptions = branchData.avaiablePromotions.length
    const daysDifference = DaysUtils.GetDatesDifferenceInDays(client.lastMessage, startupDate)

    if (daysDifference) {
      return {
        isValid: true,
        selectedOption: SelectedOption.outdatedOptions,
      }
    } else if (Validations.IsNumber(answer)) {
        const formattedAnswer = MessageUtils.FormatNumberOption(answer)
        const isValidNumber = formattedAnswer >= numberOfOptions && formattedAnswer <= numberOfOptions
        return { 
          isValid: true,
          selectedOption: isValidNumber 
            ? SelectedOption.buy 
            : SelectedOption.invalidPromotionNumber,
          formattedAnswer
        }
    } else if (answer.toUpperCase().trim() === PossibleAnswers.back) {
        return { isValid: true, selectedOption: SelectedOption.back }
    } else {
        return { isValid: false }
    }
  }

  private static AnswerFactory(
    selectedOption: SelectedOption,
    branchData: BranchData,
    formattedAnswer?: number
  ): StepInfo {
    switch (selectedOption) {
      case SelectedOption.buy:
        return new StepInfo(
          [
            'TODO: Implementar a compra direta de promoção'
          ],
          STEP_NUMBERS.mainMenu,
          StepActionEnum.BUY_PROMOTION,
          new BuyPromotionPayload(
            branchData.avaiablePromotions[formattedAnswer - 1].id,
            branchData.id
          )
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
        throw new StepError(this.STEP_NUMBER, "Answers was validated, but it wasn't possible to determine which Step to send user based on his answer")
    }
  }
}