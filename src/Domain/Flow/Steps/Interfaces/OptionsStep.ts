import BranchData from "../../../../data/Interfaces/BranchData";
import StepInfo from "../Messages/StepInfo";

export default abstract class OptionsStep {
  abstract AnswerFactory(selectedOption: number, branchData: BranchData) : StepInfo 
}