export enum StepNumbers {
  welcomeStep = 1,
  promotionStep = 2,
  enrichOrderStep = 3,
  selectDeliveryType = 3.1,
  selectPaymentMethod = 3.2,
  selectAddress = 3.3,
  setComment = 3.4,
  selectCoupom = 3.5,
  registerAddress = 4,
  registerCountry = 4.1,
  registerState = 4.2,
  registerCity = 4.3,
  registerPostalCode = 4.4,
  confirmAddress = 4.5,
  checkOrders = 7,
  confirmOrder = 8,
  closingStep = 9,
  mainMenu = 10,
}

export default interface IStep {
  STEP_NUMBER : StepNumbers
}

export interface IStepOptions {
  ADDRESS_STEP : boolean
  ORDER_STEP : boolean
}

export interface IIntroMessages {
  INTRO_MESSAGES : Array<string>
}

export interface IOptionsAnswer {
  formattedAnswer : number | string
}

