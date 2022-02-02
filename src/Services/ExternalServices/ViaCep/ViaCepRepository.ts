import { Service } from "typedi";
import Api from "../../Shared/api";
import METHODS from "../../Shared/methods";
import ViaCepPayload from "./Payloads/ViaCepPayload";

@Service()
export default class ViaCepRepository {
  private readonly Api : Api
  private readonly URL : string

  /**
   *
   */
  constructor() {
    this.Api = new Api("https://viacep.com.br/ws/")
  }

  public async ValidateCep(CEP : string) : Promise<ViaCepPayload>{
    return await this.Api.Request({ method: METHODS.GET, endpoint: `${CEP}/json/` })
  }
}