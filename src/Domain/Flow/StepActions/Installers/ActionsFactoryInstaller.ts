import staticImplements from "../../../../Shared/Anotations/staticImplements";
import IInstaller from "../../../../Shared/Interfaces/IInstaller";
import ActionsFactory from "../ActionDefinitions/ActionsFactory/ActionsFactory";
import RegisterOrderAction from "../ActionDefinitions/RegisterOrderAction/RegisterOrderAction";
import SaveAddressAction from "../ActionDefinitions/SaveAddress/SaveAddressAction";
import SendOrderAction from "../ActionDefinitions/SendOrderAction/SendOrderAction";
import UpdateAddressAction from "../ActionDefinitions/UpdateAddressAction/UpdateAddressAction";
import UpdateOrderAction from "../ActionDefinitions/UpdateOrderAction/UpdateOrderAction";

@staticImplements<IInstaller>()
export default class ActionsFactoryInstaller  {
  public static InstallServices() : void {
    ActionsFactory.RegisterAction(new SendOrderAction())
    ActionsFactory.RegisterAction(new RegisterOrderAction())
    ActionsFactory.RegisterAction(new UpdateOrderAction())
    ActionsFactory.RegisterAction(new UpdateAddressAction())
    ActionsFactory.RegisterAction(new SaveAddressAction())
  }
}