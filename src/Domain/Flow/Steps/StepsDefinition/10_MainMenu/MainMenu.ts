import Config from "../../../../../config";
import { PromotionsInformation } from "../../../../../../data/Interfaces/BranchData";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import MessageUtils from "../../../../Utils/MessageUtils";
import IStep, { StepNumbers } from "../../Interfaces/IStep";
import StepInfo from "../../Messages/StepInfo";
import ClosingStep from "../9_ClosingStep/ClosingStep";
import PromotionsSelectionStep from "../StepGenerators/PromotionsSelectionStep";
import StepError from "../../../../Abstractions/Errors/StepError";
import StepDefinition from "../../Interfaces/StepDefinition";

const options = [
  '1. Fazer pedido',
  '2. Ver promoções',
  '3. Horário de funcionamento',
  '4. Políticas de entrega',
  '5. Métodos de pagamento'
]

@staticImplements<IStep>()
export default class MainMenu extends StepDefinition {
  static STEP_NUMBER = StepNumbers.mainMenu
  
  static INTRO_MESSAGE = "Em que posso te ajudar hoje?\n(Digite o número da opção para darmos continuidade)"
  static MENU_OPTIONS = options.join("\n")

  public Interact() : StepInfo {
    const clientAnswer = this.Message.body
    if (this.ValidateAnswer()) {
      return this.AnswerFactory(MessageUtils.FormatNumberOption(clientAnswer))
    } else {
      return new StepInfo(
        [
          'Desculpe, não entendi qual opção deseja.\nFavor tentar novamente.',
          'Digite só o número da opção para darmos continuidade.',
          MainMenu.MENU_OPTIONS,
        ], 
        StepNumbers.mainMenu
      )
    }
  }

  private ValidateAnswer() : boolean {
    return /^[1-9]$/.test(this.Message.body) && Number(this.Message.body) <= options.length
  }

  private AnswerFactory(selectedOption : number) : StepInfo {
    switch (selectedOption) {
      case 1:
        return new StepInfo(
          [
            `Para fazer um pedido basta acessar o link abaixo:\n${Config.onlineMenuUrl}/${this.SessionData.branchData.id}`,
            ClosingStep.INTRO_MESSAGE,
          ],
          StepNumbers.closingStep
        )
      case 2:
        return this.PromotionsMessageFactory(this.SessionData.branchData.templateMessages.promotionsInformation)
      case 3:
        return new StepInfo(
          [
            "Nossos horários de funcionamento são:",
            this.SessionData.branchData.templateMessages.openingHours,
            ClosingStep.INTRO_MESSAGE,
          ],
          StepNumbers.closingStep
        )
      case 4:
        return new StepInfo(
          [
            "Nossa política de entrega é a seguinte:",
            this.SessionData.branchData.templateMessages.deliveryInformation,
            ClosingStep.INTRO_MESSAGE,
          ],
          StepNumbers.closingStep
        )
      case 5:
        return new StepInfo(
          [
            this.SessionData.branchData.templateMessages.paymentMethods,
            ClosingStep.INTRO_MESSAGE,
          ],
          StepNumbers.closingStep
        )
      default:
        throw new StepError(MainMenu.STEP_NUMBER, `Invalid stepNumber selected by user ${selectedOption}`)

    }
  }

  private PromotionsMessageFactory(promotions: PromotionsInformation): StepInfo {
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