import { Message } from "venom-bot";
import BranchData from "../../../../../../../data/Interfaces/BranchData";
import { CurrentlyRegistering } from "../../../../../../../data/Interfaces/ICustomerAddress";
import staticImplements from "../../../../../../Shared/Anotations/staticImplements";
import Customer from "../../../../../Models/Customer";
import CustomerAddress from "../../../../../Models/CustomerAddress";
import Order from "../../../../../Models/Order";
import { SessionData } from "../../../../Startup/BotStartUp";
import { ActionsEnum } from "../../../../StepActions/Interfaces/IActionHandler";
import IStep, { StepInteractionPayload, StepNumbers } from "../../../Interfaces/IStep";
import IValidatedStep, { ValidateParameters } from "../../../Interfaces/IValidatedStep";
import StepInfo from "../../../Messages/StepInfo";


@staticImplements<IStep>()
export default class ConfirmAddressStep {
  static STEP_NUMBER = StepNumbers.registerAddress
  
  static Interact({
    customer,
    message,
    sessionData, 
    orderInfo,
    address,
    } : StepInteractionPayload
    ) : StepInfo {
      return new StepInfo (
        ['Confirm Address'],
        StepNumbers.confirmAddress
      )
  }
}