import staticImplements from "../../../../Shared/Anotations/staticImplements";
import IInstaller from "../../../../Shared/Interfaces/IInstaller";
import MainMenu from "../StepsDefinition/10_MainMenu/MainMenu";
import WelcomeStep from "../StepsDefinition/1_WelcomeStep/WelcomeStep";
import PromotionsStep from "../StepsDefinition/2.1_PromotionsStep/PromotionsStep";
import SelectDeliveryTypeStep from "../StepsDefinition/2.2_EnrichOrderStep/2.2.1_SelectDeliveryType/SelectDeliveryTypeStep";
import SelectPaymentMethodStep from "../StepsDefinition/2.2_EnrichOrderStep/2.2.2_SelectPaymentMethod/SelectPaymentMethodStep";
import SelectAddressStep from "../StepsDefinition/2.2_EnrichOrderStep/2.2.3_SelectAddress/SelectAddressStep";
import EnrichOrderStep from "../StepsDefinition/2.2_EnrichOrderStep/EnrichOrderStep";
import RegisterStateStep from "../StepsDefinition/3_RegisterAddress/3.2_RegisterState/RegisterStateStep";
import RegisterCityStep from "../StepsDefinition/3_RegisterAddress/3.3_RegisterCity/RegisterCityStep";
import RegisterCEPStep from "../StepsDefinition/3_RegisterAddress/3.4_RegisterCEP/RegisterCEPStep";
import ConfirmAddressStep from "../StepsDefinition/3_RegisterAddress/3.5_ConfirmAddressStep/ConfirmAddressStep";
import RegisterAddressStep from "../StepsDefinition/3_RegisterAddress/RegisterAddressStep";
import ConfirmOrderStep from "../StepsDefinition/8_ConfirmOrder/ConfirmOrder";
import ClosingStep from "../StepsDefinition/9_ClosingStep/ClosingStep";
import StepFactory from "../StepsDefinition/StepFactory/StepFactory";

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
    StepFactory.RegisterStep(RegisterAddressStep)
    StepFactory.RegisterStep(RegisterStateStep)
    StepFactory.RegisterStep(RegisterCityStep)
    StepFactory.RegisterStep(RegisterCEPStep)
    StepFactory.RegisterStep(ConfirmOrderStep)
    StepFactory.RegisterStep(ConfirmAddressStep)
  }

  // TODO
  // private static ValidateInjections() {

  // }
}