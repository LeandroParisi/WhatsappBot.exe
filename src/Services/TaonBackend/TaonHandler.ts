import { Service } from "typedi";
import TaonRepository from "./TaonRepository";

@Service()
export default class TaonHandler {
  /**
   *
   */
  constructor(private readonly repository : TaonRepository) {}

  
}