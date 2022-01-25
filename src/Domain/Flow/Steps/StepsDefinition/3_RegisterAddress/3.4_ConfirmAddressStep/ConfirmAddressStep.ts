import { CurrentlyRegisteringAddress } from "../../../../../../../data/Interfaces/ICustomerAddress";
import ParserUtils from "../../../../../../Shared/Utils/ParserUtils";
import staticImplements from "../../../../../../Shared/Anotations/staticImplements";
import Validations from "../../../../Utils/Validations";
import IStep, { StepInteractionPayload, StepNumbers } from "../../../Interfaces/IStep";
import IValidatedStep, { ValidateParameters } from "../../../Interfaces/IValidatedStep";
import StepInfo from "../../../Messages/StepInfo";
import MessageUtils from "../../../../../Utils/MessageUtils";
import CustomerAddress from "../../../../../Models/CustomerAddress";
import RegisterAddressStep from "../RegisterAddressStep";
import Order from "../../../../../Models/Order";
import { ActionsEnum } from "../../../../StepActions/Interfaces/IActionHandler";

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
@staticImplements<IValidatedStep<ValidationPayload>>()
export default class ConfirmAddressStep {
  static STEP_NUMBER = StepNumbers.confirmAddress
  
  static Interact({
    customer,
    message,
    sessionData, 
    orderInfo,
    address,
    } : StepInteractionPayload
    ) : StepInfo {
      const {
        isValid,
        action,
        invalidData
      } = this.ValidateAnswer({ answer: message.body })

      if (isValid) {
        return this.GenerateStepInfo(action, invalidData, address, orderInfo)
      } else {
        return new StepInfo(
          [
            "Desculpe, não entendi sua resposta, vamos tentar de novo?",
            MessageUtils.GenerateAddressConfirmationMessage(address)
          ],
          StepNumbers.confirmAddress,
        )
      }
  }

  static ValidateAnswer({ answer } : ValidateParameters) : ValidationPayload {
    if (Validations.IsNumber(answer) && possibleAnswers.has(ParserUtils.ToNumber(answer))) {
      return {
        isValid: true,
        action: PossibleActions.CHANGE_ADDRESS,
        invalidData: ParserUtils.ToNumber(answer)
      }
    } else if (!Validations.IsNumber(answer) && possibleAnswers.has(ParserUtils.ToUpperTrim(answer))) {
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
  private static GenerateStepInfo(
      action: PossibleActions,
      invalidData: CurrentlyRegisteringAddress,
      address : CustomerAddress,
      orderInfo : Order
    ) : StepInfo {
    if (action === PossibleActions.CHANGE_ADDRESS) {
      this.EditAddress(address, invalidData)
      const nextStep = RegisterAddressStep.ExtractMissingAddressInfo(address)
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
      orderInfo.addressId = address._id
      return new StepInfo(
        [
          "Perfeito!",
          "Vamos dar sequência à finalização do seu pedido"
        ],
        StepNumbers.confirmOrder,
        [ActionsEnum.UPDATE_ORDER, ActionsEnum.SAVE_ADDRESS],
        [orderInfo, address]
      )
    }
  }
  private static EditAddress(address: CustomerAddress, invalidData: CurrentlyRegisteringAddress) : void {
    if (invalidData === CurrentlyRegisteringAddress.CITY_NAME) {
      delete address.cityName
    } else if (invalidData === CurrentlyRegisteringAddress.COUNTRY_NAME) {
      delete address.countryName
    } else if (invalidData === CurrentlyRegisteringAddress.NEIGHBORHOOD) {
      delete address.neighborhood
    } else if (invalidData === CurrentlyRegisteringAddress.POSTAL_CODE) {
      delete address.postalCode
    } else if (invalidData === CurrentlyRegisteringAddress.STATE_NAME) {
      delete address.stateName
    } else if (invalidData === CurrentlyRegisteringAddress.STREET) {
      delete address.street
    } else if (invalidData === CurrentlyRegisteringAddress.STREET_COMPLEMENT) {
      delete address.street
    } else if (invalidData === CurrentlyRegisteringAddress.STREET_NUMBER) {
      delete address.street
    }
  }
}