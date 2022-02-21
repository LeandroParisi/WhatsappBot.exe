import staticImplements from "../../../../Shared/Anotations/staticImplements"
import IInstaller from "../../../../Shared/Interfaces/IInstaller"
import MainMenu from "../StepsDefinition/10_MainMenu/MainMenu"
import WelcomeStep from "../StepsDefinition/1_WelcomeStep/WelcomeStep"
import PromotionsStep from "../StepsDefinition/2.1_PromotionsStep/PromotionsStep"
import SelectDeliveryTypeStep from "../StepsDefinition/3.2_EnrichOrderStep/3.2.1_SelectDeliveryType/SelectDeliveryTypeStep"
import SelectPaymentMethodStep from "../StepsDefinition/3.2_EnrichOrderStep/3.2.2_SelectPaymentMethod/SelectPaymentMethodStep"
import SelectAddressStep from "../StepsDefinition/3.2_EnrichOrderStep/3.2.3_SelectAddress/SelectAddressStep"
import SelectCoupomStep from "../StepsDefinition/3.2_EnrichOrderStep/3.2.5_SelectCoupom/SelectCoupomStep"
import SetCommentStep from "../StepsDefinition/3.2_EnrichOrderStep/3.2.4_SetComments/SetCommentStep"
import EnrichOrderStep from "../StepsDefinition/3.2_EnrichOrderStep/EnrichOrderStep"
import RegisterStateStep from "../StepsDefinition/4_RegisterAddress/4.2_RegisterState/RegisterStateStep"
import RegisterCityStep from "../StepsDefinition/4_RegisterAddress/4.3_RegisterCity/RegisterCityStep"
import RegisterPostalCode from "../StepsDefinition/4_RegisterAddress/4.4_RegisterPostalCode/RegisterPostalCode"
import ConfirmAddressStep from "../StepsDefinition/4_RegisterAddress/4.5_ConfirmAddressStep/ConfirmAddressStep"
import RegisterAddressStep from "../StepsDefinition/4_RegisterAddress/RegisterAddressStep"
import ConfirmOrderStep from "../StepsDefinition/8_ConfirmOrder/ConfirmOrder"
import ClosingStep from "../StepsDefinition/9_ClosingStep/ClosingStep"
import StepFactory from "../StepsDefinition/StepFactory/StepFactory"

@staticImplements<IInstaller>()
export default class StepFactoryInstaller {

  public static InstallServices() : void {
    StepFactory.RegisterStep(WelcomeStep)
    StepFactory.RegisterStep(PromotionsStep)
    StepFactory.RegisterStep(EnrichOrderStep)
    StepFactory.RegisterStep(SelectDeliveryTypeStep)
    StepFactory.RegisterStep(SelectPaymentMethodStep)
    StepFactory.RegisterStep(SelectAddressStep)
    StepFactory.RegisterStep(ClosingStep)
    StepFactory.RegisterStep(MainMenu)
    StepFactory.RegisterStep(SelectCoupomStep)
    StepFactory.RegisterStep(RegisterAddressStep)
    StepFactory.RegisterStep(SetCommentStep)
    StepFactory.RegisterStep(RegisterStateStep)
    StepFactory.RegisterStep(RegisterCityStep)
    StepFactory.RegisterStep(RegisterPostalCode)
    StepFactory.RegisterStep(ConfirmOrderStep)
    StepFactory.RegisterStep(ConfirmAddressStep)
  }

  // TODO
  // private static ValidateInjections() {

  // }
}