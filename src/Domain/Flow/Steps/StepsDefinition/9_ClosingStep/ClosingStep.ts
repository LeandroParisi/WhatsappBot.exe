import GenericParser from "../../../../../Shared/Parsers/GenericParser"
import { StepNumbers } from "../../Interfaces/IStep"
import { ValidateParameters } from "../../Interfaces/IValidatedStep"
import StepDefinition, { StepDefinitionArgs } from "../../Interfaces/StepDefinition"
import StepInfo from "../../Messages/StepInfo"
import ReturnToMenu from "../StepGenerators/ReturnToMenu"

export default class ClosingStep extends StepDefinition{
  static STEP_NUMBER = StepNumbers.closingStep
  
  static INTRO_MESSAGE = "Posso lhe ajudar em mais alguma coisa?\n1. Sim\n2. Não"

  /**
  *
  */
   constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs)
  }

  public async Interact() : Promise<StepInfo> {
    const clientAnswer = this.Message.body

    if (ClosingStep.ValidateAnswer({answer: clientAnswer.trim()})) {
      return this.AnswerFactory(GenericParser.ToNumber(clientAnswer))
    } else {
      return new StepInfo(
        [
          'Desculpe, não entendi qual opção deseja.\nFavor tentar novamente.',
          'Digite só o número da opção para darmos continuidade.',
          ClosingStep.INTRO_MESSAGE,
        ], 
        StepNumbers.closingStep
      )
    }
  }

  private AnswerFactory(selectedOption: number): StepInfo {
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
            ClosingStep.INTRO_MESSAGE
          ],
          StepNumbers.closingStep
        )
    }
  }

  static ValidateAnswer({ answer } : ValidateParameters) : boolean {
    return /^[1-2]$/.test(answer)
  }
}