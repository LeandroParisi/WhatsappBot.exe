import { Service } from "typedi"
import TaonRepository from '../../TaonBackend/TaonRepository'
import UserDataRepository from "../Repositories/UserDataRepository"
import LocationsRepository from "../Repositories/LocationsRepository"
import BranchData from '../../../Data/DTOs/BranchData'
import BranchTemplateMessagesFactory from '../../../Domain/MessageFactories/BranchTemplateMessagesFactory'
import DaysUtils from '../../../Shared/Utils/DaysUtils'
import PromotionsUtils from '../../../Shared/Utils/PromotionsUtils'
import MemoryData from "../../../Data/DTOs/MemoryData/MemoryData"
import LoginError from "../../Abstractions/Errors/LoginError"
import ILoginInfo from "../../../Data/Interfaces/ILoginInfo"

export interface InitialData {
  branchData : BranchData
  memoryData : MemoryData
}

@Service()
export default class UserDataHandler {
  loginRetries : number

  constructor(
    private readonly repository : UserDataRepository,
    private readonly TaonRepository : TaonRepository,
    private readonly LocationsRepository : LocationsRepository,
  ) {
    this.loginRetries = 0
  }

  async HasToken() : Promise<boolean> {
    const userData = await this.repository.GetLoginData()

    return !!userData
  }

  async ValidateToken() : Promise<string> {
    const userData = await this.repository.GetLoginData()

    try {
      await this.TaonRepository.ValidateSession(userData.token)
      return userData._id
    } catch (error) {
      if (error?.status === 401) {
        // await this.repository.DestroySessionData()
        throw new LoginError("Sua sessão expirou, favor tentar logar novamente", error, true)
      } else {
        throw new LoginError("Não foi possível lhe conectar, favor fazer contato com nossa equipe.", error, true)
      }
    }
  }

  async Login(loginInfo : ILoginInfo) : Promise<string> {
    try {
        const data = await this.TaonRepository.Login(loginInfo)
    
        const insertedId = await this.repository.SaveLoginData(data)
        return insertedId
    } catch (error) {
      if (error?.status === 404) {
        throw new LoginError("Senha ou email inválidos", error, true)
      } else {
        throw new LoginError("Não foi possível lhe conectar, favor fazer contato com nossa equipe.", error, true)
      }
    }
  }

  async SetStartupTime(lastStartup : Date) {
    await this.repository.UpdateUserData(
      { },
      { lastStartup }
    )
  }

  async LoadInitialData(deviceNumber : string) : Promise<InitialData> {
    const userData = await this.repository.GetLoginData()

    // TODO: Tentar tratar este erro, o catch não funcionou aqui para jogar para o handler global do index    
    const data = await this.TaonRepository.GetInitialData(userData.token, deviceNumber)

    const locations = await this.TaonRepository.GetLocations()

    const memoryData = new MemoryData(locations)

    const branchData = await this.EnrichBranchData(data)

    return { branchData, memoryData }
  }

  public async UpdateTemplateMessages(
    currentDate : Date,
    branchData : BranchData
  ) {
    const { lastStartup } = await this.repository.GetLoginData()

    const daysDifference = DaysUtils.GetDatesDifferenceInDays(currentDate, lastStartup)

    if (daysDifference) {
      return this.FilterPromotions(branchData, lastStartup)
    } else {
      return branchData
    }

  }
  
  private async EnrichBranchData(branchData: BranchData) : Promise<BranchData> {
    const { lastStartup } = await this.repository.GetLoginData()

    let enrichedBranchData = this.FilterPromotions(branchData, lastStartup)

    enrichedBranchData = this.GenerateTemplateMessages(enrichedBranchData)
    
    return enrichedBranchData
  }

  private FilterPromotions(branchData : BranchData, lastStartup : Date) : BranchData {
    const currentDay = DaysUtils.GetDayNumberFromTimestamp(lastStartup.getTime() / 1000)

    const avaiablePromotions = PromotionsUtils.GetAvaiablePromotions(branchData.promotions, currentDay)

    const enrichedBranchData = { 
      ...branchData,
      avaiablePromotions: [...avaiablePromotions],
      templateMessages: {
        ...branchData.templateMessages,
        promotionsInformation: BranchTemplateMessagesFactory.GeneratePromotionsMessage(avaiablePromotions),
      }
    }

    return enrichedBranchData
  }

  private GenerateTemplateMessages(data : BranchData) : BranchData {

    data.templateMessages.deliveryInformation = 
    BranchTemplateMessagesFactory
      .GenerateDeliveryInformationMessage(
        data.deliveryTypes,
        data.deliveryFees
      )

    data.templateMessages.openingHours = 
    BranchTemplateMessagesFactory
      .GenerateOpeningHoursMessage(data.openingHours)

    data.templateMessages.paymentMethods = 
    BranchTemplateMessagesFactory
      .GeneratePaymentMethodsMessage(data.paymentMethods)

    data.templateMessages.promotionsInformation = 
    BranchTemplateMessagesFactory
      .GeneratePromotionsMessage(data.avaiablePromotions)

    data.templateMessages.deliveryTypes = 
    BranchTemplateMessagesFactory
      .CreateDeliveryTypeText(data.deliveryTypes)

    const {paymentMethods, deliveryTypes, } = data

    return data
  }

  // eslint-disable-next-line class-methods-use-this
  async ErrorCatcher(callback: () => any) {
    try {
      const result = await callback()
      return result
    } catch (error) {
      // No need to treat error since it's already beeing treated
      // on config/database.onError event listener
      return null
    }
  }
}
