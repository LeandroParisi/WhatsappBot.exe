import { Message } from "venom-bot";
import BranchData from "../../../../../../data/Interfaces/BranchData";
import { CurrentlyRegisteringAddress } from "../../../../../../data/Interfaces/ICustomerAddress";
import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../Models/Customer";
import CustomerAddress from "../../../../Models/CustomerAddress";
import Order from "../../../../Models/Order";
import MessageUtils from "../../../../Utils/MessageUtils";
import { SessionData } from "../../../Startup/BotStartUp";
import { ActionsEnum } from "../../../StepActions/Interfaces/IActionHandler";
import IStep, { StepInteractionPayload, StepNumbers } from "../../Interfaces/IStep";
import IValidatedStep, { ValidateParameters } from "../../Interfaces/IValidatedStep";
import StepInfo from "../../Messages/StepInfo";


@staticImplements<IStep>()
export default class RegisterAddressStep {
  static STEP_NUMBER = StepNumbers.registerAddress
  
  static Interact({
    customer,
    message,
    sessionData, 
    orderInfo,
    address,
    } : StepInteractionPayload
    ) : StepInfo {
      this.UpdateAddress(address, message.body)
      return this.ExtractMissingAddressInfo(address)
  }

  private static UpdateAddress(address: CustomerAddress, answer : string) {
    if (address.currentlyRegistering === CurrentlyRegisteringAddress.COUNTRY_NAME) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.COUNTRY_NAME
      address.countryName = answer.trim()
    } else if (address.currentlyRegistering === CurrentlyRegisteringAddress.STATE_NAME) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.STATE_NAME
      address.stateName = answer.trim()
    } else if (address.currentlyRegistering === CurrentlyRegisteringAddress.CITY_NAME) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.CITY_NAME
      address.cityName = answer.trim()
    } else if (address.currentlyRegistering === CurrentlyRegisteringAddress.POSTAL_CODE) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.POSTAL_CODE
      address.postalCode = answer.trim()
    } else if (address.currentlyRegistering === CurrentlyRegisteringAddress.NEIGHBORHOOD) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.NEIGHBORHOOD
      address.neighborhood = answer.trim()
    } else if (address.currentlyRegistering === CurrentlyRegisteringAddress.STREET) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.STREET
      address.street = answer.trim()
    } else if (address.currentlyRegistering === CurrentlyRegisteringAddress.STREET_NUMBER) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.STREET_NUMBER
      address.streetNumber = answer.trim()
    } else if (address.currentlyRegistering === CurrentlyRegisteringAddress.STREET_COMPLEMENT) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.STREET_COMPLEMENT
      address.streetComplement = answer.trim()
    }
  }

  static ExtractMissingAddressInfo (
    address : CustomerAddress
  ) : StepInfo {
    if (!address.countryName) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.COUNTRY_NAME

      return new StepInfo(
        [
          "Vamos cadastrar seu *país*, favor digitar o nome do país de sua residência."
        ],
        StepNumbers.registerAddress,
        [ActionsEnum.UPSERT_ADDRESS],
        [address]
      )

    } else if (!address.stateName) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.STATE_NAME

      return new StepInfo(
        [
          "Vamos cadastrar seu *estado*, favor digitar o nome do estado de sua residência."
        ],
        StepNumbers.registerAddress,
        [ActionsEnum.UPSERT_ADDRESS],
        [address]
      )

    } else if (!address.cityName) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.CITY_NAME

      return new StepInfo(
        [
          "Vamos cadastrar sua *cidade*, favor digitar o nome da cidade de sua residência."
        ],
        StepNumbers.registerAddress,
        [ActionsEnum.UPSERT_ADDRESS],
        [address]
      )

    } else if (!address.postalCode) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.POSTAL_CODE

      return new StepInfo(
        [
          "Vamos cadastrar seu *CEP*, favor digitar o número."
        ],
        StepNumbers.registerAddress,
        [ActionsEnum.UPSERT_ADDRESS],
        [address]
      )

    } else if (!address.neighborhood) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.NEIGHBORHOOD

      return new StepInfo(
        [
          "Vamos cadastrar seu *bairro*, favor digitar o nome do bairro de sua residência."
        ],
        StepNumbers.registerAddress,
        [ActionsEnum.UPSERT_ADDRESS],
        [address]
      )

    } else if (!address.street) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.STREET

      return new StepInfo(
        [
          "Vamos cadastrar sua *rua*, favor digitar o nome da rua de sua residência."
        ],
        StepNumbers.registerAddress,
        [ActionsEnum.UPSERT_ADDRESS],
        [address]
      )

    } else if (!address.streetNumber) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.STREET_NUMBER

      return new StepInfo(
        [
          "Vamos cadastrar o *número de sua residência*, favor digitar o número."
        ],
        StepNumbers.registerAddress,
        [ActionsEnum.UPSERT_ADDRESS],
        [address]
      )

    } else if (!address.streetComplement) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.STREET_COMPLEMENT

      return new StepInfo(
        [
          "Vamos cadastrar o *complemento*, favor digitar o complemento de sua residência.",
          "Ou, caso não tenha digite *0*"
        ],
        StepNumbers.registerAddress,
        [ActionsEnum.UPSERT_ADDRESS],
        [address]
      )

    } else {
      return new StepInfo (
        [
          "Vamos confirmar seu endereço para ver se está tudo ok?",
          "Caso esteja tudo certo digite *OK*, caso algum dado esteja errado digite o número correspondente",
          MessageUtils.GenerateAddressConfirmationMessage(address)
        ],
        StepNumbers.confirmAddress,
        [ActionsEnum.UPSERT_ADDRESS],
        [address]
      )
    }
  }
}