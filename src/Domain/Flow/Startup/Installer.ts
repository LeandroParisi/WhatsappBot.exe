import staticImplements from "../../../Shared/Anotations/staticImplements";
import IInstaller from "../../../Shared/Interfaces/IInstaller";
import StepFactoryInstaller from "../Steps/Installers/StepFactoryInstaller";

@staticImplements<IInstaller>()
export default class Installer {
  public static InstallServices() : void {
    StepFactoryInstaller.InstallServices()
  }
}