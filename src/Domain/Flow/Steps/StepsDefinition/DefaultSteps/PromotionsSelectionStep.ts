import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import { STEP_NUMBERS } from "../../Interfaces/IStep";
import IStepInfo from "../../Messages/IStepInfo";
import StepInfo from "../../Messages/StepInfo";

interface options {
  promotions : string
  prefixMessages? : string[],
  sufixMessages? : string[]
}
export default class PromotionsSelectionStep {
  static GenerateMessage(
    { 
      promotions,
      prefixMessages = [],
      sufixMessages = [] 
    } : options
    ) : StepInfo {
    
    return new StepInfo(
      [
        ...prefixMessages,
        "As promoções que temos hoje são:",
        promotions,
        "Caso deseje pedir alguma basta digitar o número correspondente.",
        "Ou, se preferir, digite *voltar* para retornar ao menu anterior.",
        ...sufixMessages
      ],
      STEP_NUMBERS.promotionStep
    )
  }

} 