import { Promotion } from "../../data/Interfaces/BranchData";

export default class PromotionsUtils {
  public static GetAvaiablePromotions (promotions : Promotion[], currentDay : number) {
    return promotions.filter((promotion : Promotion) => new Set([...promotion.avaiability]).has(currentDay))
  }
}