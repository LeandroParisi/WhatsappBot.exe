import BranchData from "../../../../data/DTOs/BranchData";

export default interface BotInitialLoadPayload {
  ok : boolean
  data : BranchData
}