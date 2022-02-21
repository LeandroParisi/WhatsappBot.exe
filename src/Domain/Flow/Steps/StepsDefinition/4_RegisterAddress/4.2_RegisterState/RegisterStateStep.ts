import staticImplements from "../../../../../../Shared/Anotations/staticImplements"
import GenericParser from "../../../../../../Shared/Parsers/GenericParser"
import Validations from "../../../../Utils/Validations"
import IStep, { IOptionsAnswer, IStepOptions, StepNumbers } from "../../../Interfaces/IStep"
import StepDefinition, { StepDefinitionArgs } from "../../../Interfaces/StepDefinition"
import StepInfo from "../../../Messages/StepInfo"
import RegisterAddressStep from "../RegisterAddressStep"

@staticImplements<IStep>()
@staticImplements<IStepOptions>()
export default class RegisterStateStep extends StepDefinition implements IOptionsAnswer {
  static STEP_NUMBER = StepNumbers.registerState
  static ADDRESS_STEP = true
  static ORDER_STEP = false
  formattedAnswer : number;

  /**
  *
  */
   constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs)
    this.ADDRESS_STEP = RegisterStateStep.ADDRESS_STEP
    this.ORDER_STEP = RegisterStateStep.ORDER_STEP
  }
  
  public async Interact(): Promise<StepInfo> {
    const isValid = this.ValidateAnswer()


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