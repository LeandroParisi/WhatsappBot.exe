import staticImplements from "../../../../Shared/Anotations/staticImplements";
import IInstaller from "../../../../Shared/Interfaces/IInstaller";
import ActionsFactory from "../ActionDefinitions/ActionsFactory/ActionsFactory";
import RegisterOrderAction from "../ActionDefinitions/RegisterOrderAction/RegisterOrderAction";
import SendOrderAction from "../ActionDefinitions/SendOrderAction/SendOrderAction";

@staticImplements<IInstaller>()
export default class ActionsFactoryInstaller  {
  public static InstallServices() : void {
    ActionsFactory.RegisterAction(new SendOrderAction())
    ActionsFactory.RegisterAction(new RegisterOrderAction())
  }

}