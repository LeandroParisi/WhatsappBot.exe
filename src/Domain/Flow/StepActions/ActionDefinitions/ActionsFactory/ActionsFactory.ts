import Container, { Service } from "typedi";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import StepActionError from "../../../../Abstractions/Errors/StepActionError";
import StepError from "../../../../Abstractions/Errors/StepError";
import { StepNumbers } from "../../../Steps/Interfaces/IStep";
import { RegisterOrderDTO } from "../RegisterOrderAction/RegisterOrderDTO";
import Payload from "../../DTOs/Payload";

import BuyPromotionAction from "../BuyPromotionAction/BuyPromotionAction";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository";
import RegisterOrderAction from "../RegisterOrderAction/RegisterOrderAction";
import OrderRepository from "../../../../../Services/SessionManagement/OrderRepository";
import IActionHandler, { ActionsEnum } from "../../Interfaces/IActionHandler";

@staticImplements()
export default class ActionsFactory {

  static Create(requiredAction : ActionsEnum) : IActionHandler<Payload> {
    const taonRepository = Container.get(TaonRepository);
    const orderRepository = Container.get(OrderRepository);

    switch(requiredAction) {
      case(ActionsEnum.SEND_ORDER):
        return new BuyPromotionAction(taonRepository);
      case(ActionsEnum.REGISTER_ORDER):
        return new RegisterOrderAction(orderRepository);
      default:
        throw new StepActionError(requiredAction, `Invalid step action ${requiredAction}`)
    }
  }
}