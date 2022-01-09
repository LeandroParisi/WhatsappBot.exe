import staticImplements from "../../../../Shared/Anotations/staticImplements";
import IInstaller from "../../../../Shared/Interfaces/IInstaller";
import ActionsFactory from "../ActionDefinitions/ActionsFactory/ActionsFactory";

@staticImplements<IInstaller>()
export default class ActionsFactoryInstaller  {
  public static InstallServices() : void {
    ActionsFactory.RegisterAction()
  }

}