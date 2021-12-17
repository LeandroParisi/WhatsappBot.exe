import BranchData from "../../../../data/Interfaces/BranchData";
import StepInfo from "../Messages/StepInfo";

export default interface IOptionsStep {
  AnswerFactory(selectedOption: number, branchData: BranchData): StepInfo
}