import { Message } from "venom-bot";
import staticImplements from "../../../../Shared/Anotations/staticImplements";
import Client from "../../../Models/Client";
import IStep, { STEP_NUMBERS } from "../Interfaces/IStep";
import StepInfo from "../Messages/StepInfo";
import IMainMenu from "./IMainMenu";

const options = [
  '1. Fazer pedido',
  '2. Ver promoções',
  '3. Horário de funcionamento',
  '4. Locais de entrega',
  '5. Métodos de pagamento'
]

@staticImplements<IStep>()
export default class MainMenu implements IMainMenu  {
  static STEP_NUMBER = STEP_NUMBERS.mainMenu
  static STEP_NAME = 'Main menu';
  
  static INTRO_MESSAGE = "Em que posso te ajudar hoje?\n(Digite o número da opção para darmos continuidade)"
  static MENU_OPTIONS = options.join("\n")

  static Interact(client: Client, message: Message): StepInfo {
    if (this.ValidateAnswer(message.body)) {

    } else 
    return new StepInfo(
      [
        'Desculpe, não entendi qual opção deseja.\nFavor tentar novamente.',
        'Digite só o número da opção para darmos continuidade.',
        this.MENU_OPTIONS
      ], 
      STEP_NUMBERS.mainMenu
    )
  }

  private static ValidateAnswer(answer : string) : boolean {
    return /^[1-9]$/.test(answer) && Number(answer) <= options.length
  }

  private static MenuAnswerFactory(selectedOption : number) {
    switch (selectedOption) {
      case 1:
        
      default: 
        // TODO: Log de erro
    }
  }

}