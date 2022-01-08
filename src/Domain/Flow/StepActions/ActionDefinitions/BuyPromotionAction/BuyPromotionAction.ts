import { Service } from "typedi";
import Customer from "../../../../Models/Customer";
import { RegisterOrderDTO } from "../RegisterOrderAction/RegisterOrderDTO";
import TaonRepository from "../../../../../Services/TaonBackend/TaonRepository";
import IActionHandler from "../../Interfaces/IActionHandler";

export default class BuyPromotionAction implements IActionHandler<RegisterOrderDTO> {

  /**
   *
   */
  constructor(private readonly repository : TaonRepository) {
    
  }

  DispatchAction(payload: RegisterOrderDTO, client: Customer): Promise<void> {
    throw new Error("Method not implemented.");
  }
}