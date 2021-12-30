import { Service } from "typedi";
import Client from "../../../../Models/Client";
import { BuyPromotionPayload } from "../../DTOs/BuyPromotionPayload";
import { IStepAction } from "../../Interfaces/IStepAction";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository";

export default class BuyPromotion implements IStepAction<BuyPromotionPayload> {

  /**
   *
   */
  constructor(private readonly repository : TaonRepository) {
    
  }

  DispatchAction(payload: BuyPromotionPayload, client: Client): Promise<string> {
    throw new Error("Method not implemented.");
  }
}