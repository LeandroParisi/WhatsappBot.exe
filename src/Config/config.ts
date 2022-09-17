/* eslint-disable @typescript-eslint/no-var-requires */
import staticImplements from "../Shared/Anotations/staticImplements"
// TODO: ajustar essa bagaça
import { StepNumbers } from '../Domain/Flow/Steps/Interfaces/IStep'
import SystemUtils from "../Shared/Utils/SystemUtils"
import ElectronConfig from "./electronConfig"

require('dotenv').config()

export const NodeEnvs = {
  LOCAL_WITHOUT_ELECTRON: "LOCAL_WITHOUT_ELECTRON",
  LOCAL_WITH_ELECTRON: "LOCAL_WITH_ELECTRON"
} as const

export type NodeEnvsKeys = keyof typeof NodeEnvs;
export type NodeEnvsValues = typeof NodeEnvs[NodeEnvsKeys];

@staticImplements()
export default class Config {
  static onlineMenuUrl = process.env.ONLINE_MENU_URL || ElectronConfig.onlineMenuUrl
  static backendUrl = process.env.BACKEND_URL || ElectronConfig.backendUrl
  static dbsPath = "./databases"
  static env : NodeEnvsValues = process.env.NODE_ENV as NodeEnvsValues

  static sessionResetRules = {
    stepsToReset: SystemUtils.GetEnumNumberValues(StepNumbers).filter(n => n >= 2 && n < 10),
    lastMessageInHours: 24
  }
}