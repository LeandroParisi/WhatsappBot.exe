import staticImplements from "../../../../../../Shared/Anotations/staticImplements";
import GenericParser from "../../../../../../Shared/Parsers/GenericParser";
import Validations from "../../../../Utils/Validations";
import IStep, { IOptionsAnswer, StepNumbers } from "../../../Interfaces/IStep";
import StepDefinition from "../../../Interfaces/StepDefinition";
import StepInfo from "../../../Messages/StepInfo";
import RegisterAddressStep from "../RegisterAddressStep";

@staticImplements<IStep>()
export default class RegisterStateStep extends StepDefinition implements IOptionsAnswer {
  static STEP_NUMBER = StepNumbers.registerState
  formattedAnswer : number;
  
  public async Interact(): Promise<StepInfo> {
    const isValid = this.ValidateAnswer()

    console.log({ isValid })

    if (isValid) {
      const { stateName, id} = this.SessionData.inMemoryData.locations.GetStateByIndex(
        this.Address.countryId, this.formattedAnswer - 1
      )
      this.Address.stateId = id
      this.Address.stateName = stateName
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

    return RegisterAddressStep.ExtractMissingAddressInfo(this.Address, this.SessionData.inMemoryData)
  }

  private ValidateAnswer() : boolean {
    const isValid = Validations.IsInRange(
      this.Answer, 
      this.SessionData.inMemoryData.locations.GetStatesByCountryId(this.Address.countryId)
    )

    if (isValid) this.formattedAnswer = GenericParser.ToNumber(this.Answer)

    return isValid
  }
}