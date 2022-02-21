/* eslint-disable @typescript-eslint/no-explicit-any */
export default class GenerateTemplateMessageError extends Error {
  stepNumber: number;
  originalError: any;

  constructor (message : string, error? : any) {
    super()
    this.message = message
    this.originalError = error 
  }
}