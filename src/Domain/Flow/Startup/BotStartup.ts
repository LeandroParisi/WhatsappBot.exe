import Container, { Service } from "typedi";
import SessionHandler from "../../../Services/SessionManagement/SessionHandler";
import UserDataHandler from "../../../Services/UserData/UserDataHandler";
import DaysUtils from "../../../Shared/Utils/DaysUtils";
import BotCore from "./BotCore";
import Installer from "./Installer";

@Service()
export default class BotStartup {
  SessionHandler : SessionHandler
  UserDataHandler: UserDataHandler;

  constructor() {
    this.SessionHandler = Container.get(SessionHandler)
    this.UserDataHandler = Container.get(UserDataHandler)
  }

  public async Startup(bot : BotCore) {
    Installer.InstallServices()
    const startupDate = DaysUtils.GetDateFromTimestamp(Date.now() / 1000)
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
}