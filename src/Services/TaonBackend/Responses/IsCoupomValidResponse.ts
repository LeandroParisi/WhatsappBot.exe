export interface IsCoupomValidResponse {
  message : string
  data : ValidatedCoupom
}

export default interface ValidatedCoupom {
  isValid : boolean
  id? : number
  validationMessages?: string[]
  freeDelivery?: boolean
}
