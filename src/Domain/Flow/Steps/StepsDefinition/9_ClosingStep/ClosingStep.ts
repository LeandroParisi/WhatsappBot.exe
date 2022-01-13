import { Message } from "venom-bot"
import BranchData from "../../../../../../data/Interfaces/BranchData"
import staticImplements from "../../../../../Shared/Anotations/staticImplements"
import Customer from "../../../../Models/Customer"
import MessageUtils from "../../../../Utils/MessageUtils"
import { SessionData } from "../../../Startup/BotStartUp"
import IStep, { StepNumbers } from "../../Interfaces/IStep"
import IValidatedStep, { ValidateParameters } from "../../Interfaces/IValidatedStep"
import StepInfo from "../../Messages/StepInfo"
import ReturnToMenu from "../StepGenerators/ReturnToMenu"

@staticImplements<IStep>()
@staticImplements<IValidatedStep<boolean>>()
export default class ClosingStep {
  static STEP_NUMBER = StepNumbers.closingStep
  static STEP_NAME = "Fechamento"
  
  static INTRO_MESSAGE = "Posso lhe ajudar em mais alguma coisa?\n1. Sim\n2. Não"

  static Interact(client : Customer, message : Message, { branchData } : SessionData) : StepInfo {
    const clientAnswer = message.body

    if (this.ValidateAnswer({answer: clientAnswer.trim()})) {
      return this.AnswerFactory(MessageUtils.FormatNumberOption(clientAnswer))
    } else {
      return new StepInfo(
        [
          'Desculpe, não entendi qual opção deseja.\nFavor tentar novamente.',
          'Digite só o número da opção para darmos continuidade.',
          this.INTRO_MESSAGE,
        ], 
        StepNumbers.closingStep
      )
    }
  }

  private static AnswerFactory(selectedOption: number): StepInfo {
    switch (selectedOption) {
      case 1:
        return ReturnToMenu.GenerateMessage({})
      case 2:
        return new StepInfo(
          [
            `Entendido! Lhe desejo um ótimo dia e caso precise de ajuda no futuro basta me chamar!`,
          ],
          StepNumbers.welcomeStep
        )
      default: 
        // TODO: Setar ErrorStep Static, setando no banco um counter para evitar infinite loop
        return new StepInfo(
          [
            "Desculpe, não consegui interpretar sua última mensagem, poderia tentar novamente?",
            this.INTRO_MESSAGE
          ],
          StepNumbers.closingStep
        )
    }
  }

  static ValidateAnswer({ answer } : ValidateParameters) : boolean {
    return /^[1-2]$/.test(answer)
  }
}