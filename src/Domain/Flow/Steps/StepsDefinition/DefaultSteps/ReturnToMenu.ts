import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import { STEP_NUMBERS } from "../../Interfaces/IStep";
import IStepInfo from "../../Messages/IStepInfo";
import StepInfo from "../../Messages/StepInfo";
import MainMenu from "../10_MainMenu/MainMenu";

interface options {
  prefixMessages? : string[],
  sufixMessages? : string[]
}
export default class ReturnToMenu {
  static GenerateMessage(
    { 
      prefixMessages = [],
      sufixMessages = [] 
    } : options
    ) : StepInfo {
    
    return new StepInfo(
      [
        ...prefixMessages,
        `Perfeito! Me diga então qual informação deseja (digite o número da opção para darmos continuidade)`,
        MainMenu.MENU_OPTIONS,
      ...sufixMessages
      ],
      STEP_NUMBERS.mainMenu
    )
  }

} 