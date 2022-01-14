import { Message } from "venom-bot";
import Config from "../../../../../config";
import BranchData, { OpeningHours, Promotion, PromotionsInformation } from "../../../../../../data/Interfaces/BranchData";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../Models/Customer";
import MessageUtils from "../../../../Utils/MessageUtils";
import IStep, { StepInteractionPayload, StepNumbers } from "../../Interfaces/IStep";
import StepInfo from "../../Messages/StepInfo";
import ClosingStep from "../9_ClosingStep/ClosingStep";
import PromotionsSelectionStep from "../StepGenerators/PromotionsSelectionStep";
import StepError from "../../../../Abstractions/Errors/StepError";
import { SessionData } from "../../../Startup/BotStartUp";
import IValidatedStep, { ValidateParameters } from "../../Interfaces/IValidatedStep";

const options = [
  '1. Fazer pedido',
  '2. Ver promoções',
  '3. Horário de funcionamento',
  '4. Políticas de entrega',
  '5. Métodos de pagamento'
]

@staticImplements<IStep>()
@staticImplements<IValidatedStep<boolean>>()
export default class MainMenu {
  static STEP_NUMBER = StepNumbers.mainMenu
  static STEP_NAME = 'Main menu';
  
  static INTRO_MESSAGE = "Em que posso te ajudar hoje?\n(Digite o número da opção para darmos continuidade)"
  static MENU_OPTIONS = options.join("\n")

  static Interact({
    customer,
    message,
    sessionData: { branchData }
    } : StepInteractionPayload
    ) : StepInfo {
    const clientAnswer = message.body
    if (this.ValidateAnswer({ answer: clientAnswer })) {
      return this.AnswerFactory(MessageUtils.FormatNumberOption(clientAnswer), branchData)
    } else {
      return new StepInfo(
        [
          'Desculpe, não entendi qual opção deseja.\nFavor tentar novamente.',
          'Digite só o número da opção para darmos continuidade.',
          this.MENU_OPTIONS,
        ], 
        StepNumbers.mainMenu
      )
    }
  }

  static ValidateAnswer({
      answer
    } : ValidateParameters
    ) 
    : boolean {
    return /^[1-9]$/.test(answer) && Number(answer) <= options.length
  }

  private static AnswerFactory(selectedOption : number, branchData : BranchData) : StepInfo {
    switch (selectedOption) {
      case 1:
        return new StepInfo(
          [
            `Para fazer um pedido basta acessar o link abaixo:\n${Config.onlineMenuUrl}/${branchData.id}`,
            ClosingStep.INTRO_MESSAGE,
          ],
          StepNumbers.closingStep
        )
      case 2:
        return this.PromotionsMessageFactory(branchData.templateMessages.promotionsInformation)
      case 3:
        return new StepInfo(
          [
            "Nossos horários de funcionamento são:",
            branchData.templateMessages.openingHours,
            ClosingStep.INTRO_MESSAGE,
          ],
          StepNumbers.closingStep
        )
      case 4:
        return new StepInfo(
          [
            "Nossa política de entrega é a seguinte:",
            branchData.templateMessages.deliveryInformation,
            ClosingStep.INTRO_MESSAGE,
          ],
          StepNumbers.closingStep
        )
      case 5:
        return new StepInfo(
          [
            branchData.templateMessages.paymentMethods,
            ClosingStep.INTRO_MESSAGE,
          ],
          StepNumbers.closingStep
        )
      default:
        throw new StepError(this.STEP_NUMBER, `Invalid stepNumber selected by user ${selectedOption}`)

    }
  }

  private static PromotionsMessageFactory(promotions: PromotionsInformation): StepInfo {
    if (promotions.hasPromotions) {
      return PromotionsSelectionStep.GenerateMessage({ promotions: promotions.message })
    } else {
      return new StepInfo (
        [
          "Infelizmente hoje estamos sem nenhuma promoção disponível.",
          ClosingStep.INTRO_MESSAGE
        ],
        StepNumbers.closingStep
      )
    }
  }

}