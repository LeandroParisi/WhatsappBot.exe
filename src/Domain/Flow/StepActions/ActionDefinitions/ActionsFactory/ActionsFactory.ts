import Container, { Service } from "typedi";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import StepActionError from "../../../../Abstractions/Errors/StepActionError";
import StepError from "../../../../Abstractions/Errors/StepError";
import { STEP_NUMBERS } from "../../../Steps/Interfaces/IStep";
import { BuyPromotionPayload } from "../../DTOs/BuyPromotionPayload";
import Payload from "../../DTOs/Payload";
import { IStepAction, StepActionEnum } from "../../Interfaces/IStepAction";
import BuyPromotion from "../BuyPromotion/BuyPromotion";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository";

@staticImplements()
export default class ActionsFactory {

  static Create(requiredAction : StepActionEnum) : IStepAction<Payload> {
    const taonRepository = Container.get(TaonRepository);

    switch(requiredAction) {
      case(StepActionEnum.BUY_PROMOTION):
        return new BuyPromotion(taonRepository);
      default:
        throw new StepActionError(requiredAction, `Invalid step action ${requiredAction}`)
    }
  }
}