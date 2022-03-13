import ViaCepPayload from "../../Services/ExternalServices/ViaCep/Payloads/ViaCepPayload"

export default class CepInfo {
  cep : string
  stateCode : string
  cityName : string
  neighborhood : string
  street : string

  /**
   *
   */
  constructor(viaCepInfo : ViaCepPayload) {
    this.cep = viaCepInfo.cep
    this.stateCode = viaCepInfo.uf
    this.cityName = viaCepInfo.localidade
    this.neighborhood = viaCepInfo.bairro
    this.street = viaCepInfo.logradouro
  }

}