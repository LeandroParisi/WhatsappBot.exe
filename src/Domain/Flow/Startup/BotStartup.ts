import Container, { Service } from "typedi";
import SessionHandler from "../../../Services/SessionManagement/Handlers/SessionHandler";
import UserDataHandler from "../../../Services/UserData/Handlers/UserDataHandler";
import LocationsRepository from "../../../Services/UserData/Repositories/LocationsRepository";
import DaysUtils from "../../../Shared/Utils/DaysUtils";
import BotCore from "./BotCore";
import Installer from "./Installer";

@Service()
export default class BotStartup {
  SessionHandler : SessionHandler
  UserDataHandler: UserDataHandler;
  LocationsRepository : LocationsRepository

  constructor() {
    this.SessionHandler = Container.get(SessionHandler)
    this.UserDataHandler = Container.get(UserDataHandler)
    this.LocationsRepository = Container.get(LocationsRepository)
  }

  public async Startup(bot : BotCore) {
    Installer.InstallServices()
    const startupDate = DaysUtils.GetDateFromTimestamp(Date.now() / 1000)
    await this.CleanUp()
    await this.ValidateUser(startupDate);
    bot.SetStartupDate(startupDate)
    await this.SessionHandler.ValidateCurrentSessions(startupDate);
  }

  private async ValidateUser(startupDate : Date) : Promise<void> {
    const userId = await this.UserDataHandler.ValidateUser();
    await this.UserDataHandler.SetStartupTime(userId, startupDate)
  }

  public async LoadUserInfo(venomBot : any, bot : BotCore) {
    const botInfo = await venomBot.getHostDevice(); 
    const { id: { user : deviceNumber } } = botInfo
    
    const branchData = await this.UserDataHandler.LoadInitialData(deviceNumber);

    bot.SetBranchData(branchData)
  }

  private async CleanUp() {
    await this.LocationsRepository.CleanUp();
  }
}