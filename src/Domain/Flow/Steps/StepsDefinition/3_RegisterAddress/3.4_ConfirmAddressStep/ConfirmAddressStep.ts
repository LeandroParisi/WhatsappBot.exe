import { CurrentlyRegisteringAddress } from "../../../../../../../data/Interfaces/ICustomerAddress";
import ParserUtils from "../../../../../../Shared/Utils/ParserUtils";
import staticImplements from "../../../../../../Shared/Anotations/staticImplements";
import Validations from "../../../../Utils/Validations";
import IStep, {  StepNumbers } from "../../../Interfaces/IStep";
import StepInfo from "../../../Messages/StepInfo";
import MessageUtils from "../../../../../Utils/MessageUtils";
import RegisterAddressStep from "../RegisterAddressStep";
import { ActionsEnum } from "../../../../StepActions/Interfaces/IActionHandler";
import StepDefinition from "../../../Interfaces/StepDefinition";

interface ValidationPayload {
  isValid : boolean,
  invalidData? : CurrentlyRegisteringAddress
  action? : PossibleActions
}

enum PossibleActions {
  CONFIRM = 1,
  CHANGE_ADDRESS = 2
}

const possibleAnswers = new Set([...Object.values(CurrentlyRegisteringAddress), 'OK'])

@staticImplements<IStep>()
export default class ConfirmAddressStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.confirmAddress
  
  public Interact() : StepInfo {
      const {
        isValid,
        action,
        invalidData
      } = this.ValidateAnswer()

      if (isValid) {
        return this.GenerateStepInfo(action, invalidData)
      } else {
        return new StepInfo(
          [
            "Desculpe, não entendi sua resposta, vamos tentar de novo?",
            MessageUtils.GenerateAddressConfirmationMessage(this.Address)
          ],
          StepNumbers.confirmAddress,
        )
      }
  }

  private ValidateAnswer() : ValidationPayload {
    if (Validations.IsNumber(this.Answer) && possibleAnswers.has(ParserUtils.ToNumber(this.Answer))) {
      return {
        isValid: true,
        action: PossibleActions.CHANGE_ADDRESS,
        invalidData: ParserUtils.ToNumber(this.Answer)
      }
    } else if (!Validations.IsNumber(this.Answer) && possibleAnswers.has(ParserUtils.ToUpperTrim(this.Answer))) {
      return {
        isValid: true,
        action: PossibleActions.CONFIRM
      }
    } else {
      return {
        isValid: false
      }
    }
  }

  private GenerateStepInfo(
      action: PossibleActions,
      invalidData: CurrentlyRegisteringAddress,
    ) : StepInfo {
    if (action === PossibleActions.CHANGE_ADDRESS) {
      this.EditAddress(invalidData)
      const nextStep = RegisterAddressStep.ExtractMissingAddressInfo(this.Address)
      return new StepInfo(
        [
          "Perfeito",
          ...nextStep.outboundMessages
        ],
        nextStep.nextStep,
        nextStep.requiredAction,
        nextStep.actionPayload
      )
    } else {
      this.OrderInfo.addressId = this.Address._id
      return new StepInfo(
        [
          "Perfeito!",
          "Vamos dar sequência à finalização do seu pedido"
        ],
        StepNumbers.confirmOrder,
        [ActionsEnum.UPDATE_ORDER, ActionsEnum.SAVE_ADDRESS],
        [this.OrderInfo, this.Address]
      )
    }
  }

  private EditAddress(invalidData: CurrentlyRegisteringAddress) : void {
    if (invalidData === CurrentlyRegisteringAddress.CITY_NAME) {
      delete this.Address.cityName
    } else if (invalidData === CurrentlyRegisteringAddress.COUNTRY_NAME) {
      delete this.Address.countryName
    } else if (invalidData === CurrentlyRegisteringAddress.NEIGHBORHOOD) {
      delete this.Address.neighborhood
    } else if (invalidData === CurrentlyRegisteringAddress.POSTAL_CODE) {
      delete this.Address.postalCode
    } else if (invalidData === CurrentlyRegisteringAddress.STATE_NAME) {
      delete this.Address.stateName
    } else if (invalidData === CurrentlyRegisteringAddress.STREET) {
      delete this.Address.street
    } else if (invalidData === CurrentlyRegisteringAddress.STREET_COMPLEMENT) {
      delete this.Address.street
    } else if (invalidData === CurrentlyRegisteringAddress.STREET_NUMBER) {
      delete this.Address.street
    }
  }
}