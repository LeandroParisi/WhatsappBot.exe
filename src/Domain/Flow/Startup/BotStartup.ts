import { Service } from "typedi"
import SessionHandler from "../../../Services/SessionManagement/Handlers/SessionHandler"
import AddressesRepository from "../../../Services/SessionManagement/Repositories/AddressesRepository"
import OrderRepository from "../../../Services/SessionManagement/Repositories/OrderRepository"
import PendingOrdersRepository from "../../../Services/SessionManagement/Repositories/PendingOrdersRepository"
import UserDataHandler from "../../../Services/UserData/Handlers/UserDataHandler"
import LocationsRepository from "../../../Services/UserData/Repositories/LocationsRepository"
import DaysUtils from "../../../Shared/Utils/DaysUtils"
import BotCore from "./BotCore"
import Installer from "./Installer"

@Service()
export default class BotStartup {
  constructor(
    private readonly OrderRepository : OrderRepository,
    private readonly AddressesRepository : AddressesRepository,
    private readonly SessionHandler : SessionHandler,
    private readonly UserDataHandler : UserDataHandler,
    private readonly LocationsRepository : LocationsRepository,
    private readonly PendingOrdersRepository : PendingOrdersRepository,
  ) {}

  public InstallServices() {
    Installer.InstallServices()
  }

  public async Startup(bot : BotCore) {
    const startupDate = DaysUtils.GetDateFromTimestamp(Date.now() / 1000)

    await this.CleanUp()
    await this.SessionHandler.ValidateCurrentSessions(startupDate)
    await this.UserDataHandler.SetStartupTime(startupDate)

    bot.SetStartupDate(startupDate)
  }

  public async LoadUserInfo(venomBot : any, bot : BotCore) {
    const botInfo = await venomBot.getHostDevice() 
    console.log({botInfo})
    const { id: { user : deviceNumber } } = botInfo
    console.log({botInfo})
    
    const { branchData, memoryData } = await this.UserDataHandler.LoadInitialData(deviceNumber)

    bot.SetBranchData(branchData)
    bot.SetMemoryData(memoryData)
  }

  private async CleanUp() {
    await this.LocationsRepository.CleanUp()
    await this.OrderRepository.CleanUp()
    await this.AddressesRepository.CleanUp()
    await this.PendingOrdersRepository.CleanUp()
  }
}