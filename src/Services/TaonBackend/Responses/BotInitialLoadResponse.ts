import BranchData from "../../../../data/DTOs/BranchData";

export default interface BotInitialLoadResponse {
  ok : boolean
  data : BranchData
}