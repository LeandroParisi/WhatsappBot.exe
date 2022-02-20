import staticImplements from "../../../../../../Shared/Anotations/staticImplements";
import Validations from "../../../../Utils/Validations";
import IStep, {  IStepOptions, StepNumbers } from "../../../Interfaces/IStep";
import StepInfo from "../../../Messages/StepInfo";
import MessageUtils from "../../../../../MessageFactories/AddressMessageFactory";
import RegisterAddressStep from "../RegisterAddressStep";
import { ActionsEnum } from "../../../../StepActions/Interfaces/IActionHandler";
import StepDefinition, { StepDefinitionArgs } from "../../../Interfaces/StepDefinition";
import GenericParser from "../../../../../../Shared/Parsers/GenericParser";
import CustomerAddress, { CurrentlyRegisteringAddress } from "../../../../../../../data/Models/CustomerAddress";
import EnrichOrderStep from "../../3.2_EnrichOrderStep/EnrichOrderStep";
import ActionsUtils from "../../../../Utils/ActionsUtils";

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
@staticImplements<IStepOptions>()
export default class ConfirmAddressStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.confirmAddress
  static ADDRESS_STEP = true
  static ORDER_STEP = true

  /**
  *
  */
    constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs);
    this.ORDER_STEP = ConfirmAddressStep.ORDER_STEP
    this.ADDRESS_STEP = ConfirmAddressStep.ADDRESS_STEP
  }
  
  public async Interact() : Promise<StepInfo> {
      const {
        isValid,
        action,
        invalidData
      } = this.ValidateAnswer()

      if (isValid) {
        return await this.GenerateStepInfo(action, invalidData)
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
    if (Validations.IsNumber(this.Answer) && possibleAnswers.has(GenericParser.ToNumber(this.Answer))) {
      return {
        isValid: true,
        action: PossibleActions.CHANGE_ADDRESS,
        invalidData: GenericParser.ToNumber(this.Answer)
      }
    } else if (!Validations.IsNumber(this.Answer) && possibleAnswers.has(GenericParser.ToUpperTrim(this.Answer))) {
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

  private async GenerateStepInfo(
      action: PossibleActions,
      invalidData: CurrentlyRegisteringAddress,
    ) : Promise<StepInfo> {
    if (action === PossibleActions.CHANGE_ADDRESS) {
      this.EditAddress(invalidData)
      const nextStep = RegisterAddressStep.ExtractMissingAddressInfo(this.Address, this.SessionData.inMemoryData)
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
      this.OrderInfo.GetNextOrderRegisteringStep()

      // this.OrderInfo.currentlyRegistering = GetNextOrderRegisteringStep(this.OrderInfo.currentlyRegistering)

      const nextStep = EnrichOrderStep.ExtractMissingOrderInfo(this.OrderInfo, this.SessionData, this.Customer)

      return new StepInfo(
        [
          "Perfeito, seu novo endereço será cadastrado.",
          "Vamos dar continuidade ao seu pedido.",
          ...nextStep.outboundMessages,
        ],
        nextStep.nextStep,
        // TODO: salvar o Address no banco primeiro, depois dar o update da order
        [ActionsEnum.SAVE_ADDRESS, ActionsEnum.UPDATE_ORDER, ...ActionsUtils.ExtractActions(nextStep)],
        [this.Address, this.OrderInfo, ...ActionsUtils.ExtractActionsPayload(nextStep)]
      )
    }
  }

  private EditAddress(invalidData: CurrentlyRegisteringAddress) : void {
    if (invalidData === CurrentlyRegisteringAddress.COUNTRY_NAME) {
      delete this.Address.countryName
      delete this.Address.countryId
      EditAddressAuxiliary.DeleteState(this.Address)
      EditAddressAuxiliary.DeleteCity(this.Address)
    } else if (invalidData === CurrentlyRegisteringAddress.STATE_NAME) {
      EditAddressAuxiliary.DeleteState(this.Address)
      EditAddressAuxiliary.DeleteCity(this.Address)
    } else if (invalidData === CurrentlyRegisteringAddress.CITY_NAME) {
      EditAddressAuxiliary.DeleteCity(this.Address)
    } else if (invalidData === CurrentlyRegisteringAddress.NEIGHBORHOOD) {
      delete this.Address.neighborhood
    } else if (invalidData === CurrentlyRegisteringAddress.POSTAL_CODE) {
      delete this.Address.postalCode
      EditAddressAuxiliary.DeleteState(this.Address)
      EditAddressAuxiliary.DeleteCity(this.Address)
    } else if (invalidData === CurrentlyRegisteringAddress.STREET) {
      delete this.Address.street
    } else if (invalidData === CurrentlyRegisteringAddress.STREET_COMPLEMENT) {
      delete this.Address.streetComplement
    } else if (invalidData === CurrentlyRegisteringAddress.STREET_NUMBER) {
      delete this.Address.streetNumber
    }
  }
}

class EditAddressAuxiliary {
  public static DeleteState(address : CustomerAddress) {
    delete address.stateName
    delete address.stateId
  }

  public static DeleteCity(address : CustomerAddress) {
    delete address.cityName
    delete address.cityId
  }
}