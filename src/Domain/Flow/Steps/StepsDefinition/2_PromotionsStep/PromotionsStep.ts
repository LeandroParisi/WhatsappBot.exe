import { Message } from "venom-bot";
import BranchData from "../../../../../data/Interfaces/BranchData";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Client from "../../../../Models/Client";
import IStep, { STEP_NUMBERS } from "../../Interfaces/IStep";
import MainMenu from "../10_MainMenu/MainMenu";
import StepInfo from "../../Messages/StepInfo";
import IOptionsStep from "../../Interfaces/IOptionsStep";
import Validations from "../../../Utils/Validations";
import BranchDataUtils from "../../../../Utils/BranchDataUtils";
import MessageUtils from "../../../../Utils/MessageUtils";
import PromotionsSelectionStep from "../DefaultSteps/PromotionsSelectionStep";


enum PossibleAnswers {
  back = "VOLTAR",
}

@staticImplements<IStep>()
// @staticImplements<IOptionsStep>()
export default class PromotionsStep {
  static STEP_NUMBER = STEP_NUMBERS.promotionStep
  static STEP_NAME = "Selecionar promoção"
  
  static Interact(client: Client, message : Message, branchData : BranchData) : StepInfo {
    const clientAnswer = message.body
    if (this.ValidateAnswer(clientAnswer, branchData.promotions.length)) {
      console.log('Promotions validation')
      console.log(this.ValidateAnswer(clientAnswer, branchData.promotions.length))
      return PromotionsSelectionStep.GenerateMessage({
        promotions: branchData.formattedPromotions, 
        prefixMessages: ['VALIDO!, mas vamos testar essa porra!'] 
      })
    } else {
      return PromotionsSelectionStep.GenerateMessage({ 
        promotions: branchData.formattedPromotions, 
        prefixMessages: ['Desculpe, não entendi qual opção deseja.\nFavor tentar novamente.'] 
      })
    }
  }

  private static ValidateAnswer(answer : string, numberOfOptions : number) : boolean {
    if (Validations.IsNumber(answer)) {
      const formattedAnswer = MessageUtils.FormatNumberOption(answer)
      return formattedAnswer >= numberOfOptions && formattedAnswer <= numberOfOptions
    } else if (answer.toUpperCase().trim() === PossibleAnswers.back) {
      return true
    } else {
      return false
    }
  }

  // static AnswerFactory(selectedOption : number, branchData : BranchData) : StepInfo {
  //   switch (selectedOption) {
      
  //   }
  // }
}