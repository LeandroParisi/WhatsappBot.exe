import Container from "typedi";
import CepInfo from "../../../../../../../data/DTOs/CepInfo";
import ValidateCepRepository from "../../../../../../Services/ExternalServices/ViaCep/ValidateCepRepository";
import staticImplements from "../../../../../../Shared/Anotations/staticImplements";
import Validations from "../../../../Utils/Validations";
import IStep, { IStepOptions, StepNumbers } from "../../../Interfaces/IStep";
import StepDefinition, { StepDefinitionArgs } from "../../../Interfaces/StepDefinition";
import StepInfo from "../../../Messages/StepInfo";
import RegisterAddressStep from "../RegisterAddressStep";

@staticImplements<IStep>()
@staticImplements<IStepOptions>()
export default class RegisterPostalCode extends StepDefinition  {
  static STEP_NUMBER = StepNumbers.registerPostalCode
  private cepInfo : CepInfo
  static ADDRESS_STEP = true
  static ORDER_STEP = false

  /**
  *
  */
   constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs);
    this.ADDRESS_STEP = RegisterPostalCode.ADDRESS_STEP
    this.ORDER_STEP = RegisterPostalCode.ORDER_STEP
  }
  
  public async Interact(): Promise<StepInfo> {
    this.Answer = this.ParseCep()

    const isValid = await this.ValidateAnswer()

    if (isValid) {
      this.UpdateAddress()

      return RegisterAddressStep.ExtractMissingAddressInfo(this.Address, this.SessionData.inMemoryData)
    } else {
      const nextStep = RegisterAddressStep.ExtractMissingAddressInfo(this.Address, this.SessionData.inMemoryData)

      return new StepInfo(
        [
          "Desculpe, a opção que você escolheu é inválida, vamos tentar novamente?",
          ...nextStep.outboundMessages
        ],
        nextStep.nextStep,
        nextStep.requiredAction,
        nextStep.actionPayload
      )
    }
  }

  private UpdateAddress() {
    const selectedState = this.SessionData.inMemoryData.locations.TryGetStateByCode(this.cepInfo.stateCode)
    const selectedCity = this.SessionData.inMemoryData.locations.TryGetCityByName(this.cepInfo.cityName)

    this.Address.stateId = selectedState.id
    this.Address.stateName = selectedState.stateName

    this.Address.cityId = selectedCity.id
    this.Address.cityName = selectedCity.cityName

    this.Address.neighborhood = this.cepInfo.neighborhood
    this.Address.street = this.cepInfo.street

    this.Address.postalCode = this.Answer
  }

  private ParseCep() : string {
    return this.Answer.match(/\d+/g).join('')
  }

  private async ValidateAnswer() : Promise<boolean> {
    let isAnswerValid = this.isValidCep()

    if (!isAnswerValid) return isAnswerValid

    const viaCepApi = Container.get(ValidateCepRepository)

    try {
      this.cepInfo = await viaCepApi.ValidateCep(this.Answer)
      return true
    } catch(error) {
      return false
    }
  }

  private isValidCep() : boolean {
    return Validations.IsNumberIncludingZero(this.Answer) && this.Answer.length === 8
  }
}


