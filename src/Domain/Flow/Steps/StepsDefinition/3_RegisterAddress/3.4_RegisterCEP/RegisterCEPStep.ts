import Container from "typedi";
import ViaCepRepository from "../../../../../../Services/ExternalServices/ViaCep/ViaCepRepository";
import staticImplements from "../../../../../../Shared/Anotations/staticImplements";
import GenericParser from "../../../../../../Shared/Parsers/GenericParser";
import Validations from "../../../../Utils/Validations";
import IStep, { IOptionsAnswer, StepNumbers } from "../../../Interfaces/IStep";
import StepDefinition from "../../../Interfaces/StepDefinition";
import StepInfo from "../../../Messages/StepInfo";
import RegisterAddressStep from "../RegisterAddressStep";

@staticImplements<IStep>()
export default class RegisterCEPStep extends StepDefinition implements IOptionsAnswer {
  static STEP_NUMBER = StepNumbers.registerCEP
  formattedAnswer : number;
  
  public async Interact(): Promise<StepInfo> {
    const isValid = await this.ValidateAnswer()

    return RegisterAddressStep.ExtractMissingAddressInfo(this.Address, this.SessionData.inMemoryData)
  }

  private async ValidateAnswer() : Promise<boolean> {
    // Limpar a resposta para tirar caracteres especiais *regex
    // mudar esse step para antes do estado e cidade
    // pegar o estado e cidade e já jogar para o address em caso de sucesso

    const viaCepApi = Container.get(ViaCepRepository)

    try {
      const cepAddress = await viaCepApi.ValidateCep(this.Answer)
      console.log({ cepAddress })
    } catch(error) {
      console.log("Ainda no step")
      console.log(error)
    }

    return true
  }
}