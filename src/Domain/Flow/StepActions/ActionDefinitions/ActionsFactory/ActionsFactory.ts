import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Payload from "../../DTOs/Payload";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";
import { Dictionary } from "../../../../../Shared/Utils/SystemUtils";


@staticImplements()
export default class ActionsFactory {

  private static ActionWarehouse : Dictionary<IActionHandler<Payload>> = {}

  static Create(actionName : ActionsEnum) : IActionHandler<Payload> {
    try {
      return this.ActionWarehouse[actionName]
    } catch {
      throw new Error("Unregistered Step Action type and number")
    }
  }

  public static RegisterAction(action : IActionHandler<Payload>) {
    this.ActionWarehouse[action.actionName] = action
  }
}
