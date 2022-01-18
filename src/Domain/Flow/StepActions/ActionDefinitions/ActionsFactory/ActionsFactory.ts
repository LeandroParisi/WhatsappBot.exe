import Container, { Service } from "typedi";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import StepActionError from "../../../../Abstractions/Errors/StepActionError";
import StepError from "../../../../Abstractions/Errors/StepError";
import { StepNumbers } from "../../../Steps/Interfaces/IStep";
import { RegisterOrderDTO } from "../RegisterOrderAction/RegisterOrderDTO";
import Payload from "../../DTOs/Payload";

import BuyPromotionAction from "../SendOrderAction/SendOrderAction";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository";
import RegisterOrderAction from "../RegisterOrderAction/RegisterOrderAction";
import OrderRepository from "../../../../../Services/SessionManagement/OrderRepository";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";
import { Dictionary } from "../../../../../Shared/Utils/SystemUtils";


@staticImplements()
export default class ActionsFactory {

  private static ActionWarehouse : Dictionary<IActionHandler<Payload>>

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
