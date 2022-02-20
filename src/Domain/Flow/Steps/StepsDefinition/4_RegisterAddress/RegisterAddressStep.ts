import staticImplements from "../../../../../Shared/Anotations/staticImplements";
import CustomerAddress, { CurrentlyRegisteringAddress } from "../../../../../../data/Models/CustomerAddress";
import MessageUtils from "../../../../MessageFactories/AddressMessageFactory";
import { ActionsEnum } from "../../../StepActions/Interfaces/IActionHandler";
import IStep, { IStepOptions, StepNumbers } from "../../Interfaces/IStep";
import StepDefinition, { StepDefinitionArgs } from "../../Interfaces/StepDefinition";
import StepInfo from "../../Messages/StepInfo";
import { Service } from "typedi";
import AddressMessageFactory from "../../../../MessageFactories/AddressMessageFactory";
import MemoryData from "../../../../../../data/DTOs/MemoryData/MemoryData";


@staticImplements<IStep>()
@staticImplements<IStepOptions>()
export default class RegisterAddressStep extends StepDefinition {
  static STEP_NUMBER = StepNumbers.registerAddress
  static ADDRESS_STEP = true
  static ORDER_STEP = true
  
  /**
  *
  */
    constructor(stepDefinitionArgs : StepDefinitionArgs) {
    super(stepDefinitionArgs);
    this.ORDER_STEP = RegisterAddressStep.ORDER_STEP
    this.ADDRESS_STEP = RegisterAddressStep.ADDRESS_STEP
  }

  public async Interact() : Promise<StepInfo> {
      this.UpdateAddress()
      return RegisterAddressStep.ExtractMissingAddressInfo(this.Address, this.SessionData.inMemoryData)
  }

  private UpdateAddress() {
    if (this.Address.currentlyRegistering === CurrentlyRegisteringAddress.COUNTRY_NAME) {
      this.Address.currentlyRegistering = CurrentlyRegisteringAddress.COUNTRY_NAME
      this.Address.countryName = this.Answer.trim()
    } else if (this.Address.currentlyRegistering === CurrentlyRegisteringAddress.STATE_NAME) {
      this.Address.currentlyRegistering = CurrentlyRegisteringAddress.STATE_NAME
      this.Address.stateName = this.Answer.trim()
    } else if (this.Address.currentlyRegistering === CurrentlyRegisteringAddress.CITY_NAME) {
      this.Address.currentlyRegistering = CurrentlyRegisteringAddress.CITY_NAME
      this.Address.cityName = this.Answer.trim()
    } else if (this.Address.currentlyRegistering === CurrentlyRegisteringAddress.POSTAL_CODE) {
      this.Address.currentlyRegistering = CurrentlyRegisteringAddress.POSTAL_CODE
      this.Address.postalCode = this.Answer.trim()
    } else if (this.Address.currentlyRegistering === CurrentlyRegisteringAddress.NEIGHBORHOOD) {
      this.Address.currentlyRegistering = CurrentlyRegisteringAddress.NEIGHBORHOOD
      this.Address.neighborhood = this.Answer.trim()
    } else if (this.Address.currentlyRegistering === CurrentlyRegisteringAddress.STREET) {
      this.Address.currentlyRegistering = CurrentlyRegisteringAddress.STREET
      this.Address.street = this.Answer.trim()
    } else if (this.Address.currentlyRegistering === CurrentlyRegisteringAddress.STREET_NUMBER) {
      this.Address.currentlyRegistering = CurrentlyRegisteringAddress.STREET_NUMBER
      this.Address.streetNumber = this.Answer.trim()
    } else if (this.Address.currentlyRegistering === CurrentlyRegisteringAddress.STREET_COMPLEMENT) {
      this.Address.currentlyRegistering = CurrentlyRegisteringAddress.STREET_COMPLEMENT
      this.Address.streetComplement = this.Answer.trim()
    }
  }

  static ExtractMissingAddressInfo (
    address : CustomerAddress,
    memoryData : MemoryData
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

    } else if (!address.postalCode) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.POSTAL_CODE

      return new StepInfo(
        [
          "Vamos cadastrar seu *CEP*, favor digitar *somente* os números."
        ],
        StepNumbers.registerPostalCode,
        [ActionsEnum.UPSERT_ADDRESS],
        [address]
      )

    } else if (!address.stateName) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.STATE_NAME
      return new StepInfo(
        [
          "Vamos cadastrar seu *estado*, favor digitar *número* do seu estado de residência da lista abaixo:",
          memoryData.locations.ParseStatesByCountryId(address.countryId)
        ],
        StepNumbers.registerState,
        [ActionsEnum.UPSERT_ADDRESS],
        [address]
      )

    } else if (!address.cityName) {
      address.currentlyRegistering = CurrentlyRegisteringAddress.CITY_NAME

      return new StepInfo(
        [
          "Vamos cadastrar sua *cidade*, favor digitar *número* da sua cidade de residência da lista abaixo:",
          memoryData.locations.ParseCitiesByStateId(address.stateId)
        ],
        StepNumbers.registerCity,
        [ActionsEnum.UPSERT_ADDRESS],
        [address]
      )

    }  else if (!address.neighborhood) {
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
          MessageUtils.GenerateAddressConfirmationMessage(address),
          "Caso esteja tudo certo digite *OK*, caso algum dado esteja errado digite o número correspondente",
        ],
        StepNumbers.confirmAddress,
        [ActionsEnum.UPSERT_ADDRESS],
        [address]
      )
    }
  }
}