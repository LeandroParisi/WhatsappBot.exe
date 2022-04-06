/* eslint-disable @typescript-eslint/no-var-requires */
import staticImplements from "./Shared/Anotations/staticImplements"
// TODO: ajustar essa bagaça
import { StepNumbers } from './Domain/Flow/Steps/Interfaces/IStep'
import SystemUtils from "./Shared/Utils/SystemUtils"
import ElectronConfig from "./electronConfig"

require('dotenv').config()

@staticImplements()
export default class Config {
  static onlineMenuUrl = process.env.ONLINE_MENU_URL || ElectronConfig.onlineMenuUrl
  static backendUrl = process.env.BACKEND_URL || ElectronConfig.backendUrl
  static dbsPath = "./databases"

  static sessionResetRules = {
    stepsToReset: SystemUtils.GetEnumNumberValues(StepNumbers).filter(n => n >= 2 && n < 10),
    lastMessageInHours: 24
  }
}