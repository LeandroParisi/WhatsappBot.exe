import BranchData from "../../../Data/DTOs/BranchData"

export default interface BotInitialLoadResponse {
  ok : boolean
  data : BranchData
}