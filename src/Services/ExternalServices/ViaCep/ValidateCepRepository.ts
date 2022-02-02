import { Service } from "typedi";
import CepInfo from "../../../../data/DTOs/CepInfo";
import Api from "../../Shared/api";
import METHODS from "../../Shared/methods";
import ViaCepPayload from "./Payloads/ViaCepPayload";

@Service()
export default class ValidateCepRepository {
  private readonly Api : Api

  /**
   *
   */
  constructor() {
    this.Api = new Api("https://viacep.com.br/ws/")
  }

  public async ValidateCep(CEP : string) : Promise<CepInfo>{
    const viaCepInfo = await this.Api.Request<ViaCepPayload>({ method: METHODS.GET, endpoint: `${CEP}/json/` })
    return new CepInfo(viaCepInfo)
  }
}