export const CurrentlyRegisteringOrder = {
  DELIVERY_TYPE: 'DELIVERY_TYPE',
  PAYMENT_METHOD: 'PAYMENT_METHOD',
  ADDRESS: 'ADDRESS',
  COUPOM: 'COUPOM',
  COMMENTS: 'COMMENTS',
  DELIVERY_FEE: 'DELIVERY_FEE',
  FINISHED: 'FINISHED',
}

export type CurrentlyRegisteringOrderKeys = keyof typeof CurrentlyRegisteringOrder;
export type CurrentlyRegisteringOrderValues = typeof CurrentlyRegisteringOrder[CurrentlyRegisteringOrderKeys];

export const NextStep = {
   [CurrentlyRegisteringOrder.DELIVERY_TYPE]: CurrentlyRegisteringOrder.PAYMENT_METHOD,
   [CurrentlyRegisteringOrder.PAYMENT_METHOD]: CurrentlyRegisteringOrder.ADDRESS,
   [CurrentlyRegisteringOrder.ADDRESS]: CurrentlyRegisteringOrder.DELIVERY_FEE,
   [CurrentlyRegisteringOrder.DELIVERY_FEE]: CurrentlyRegisteringOrder.COMMENTS,
   [CurrentlyRegisteringOrder.COMMENTS]: CurrentlyRegisteringOrder.COUPOM,
   [CurrentlyRegisteringOrder.COUPOM]: CurrentlyRegisteringOrder.FINISHED,
}

export type NextStepKeys = keyof typeof NextStep;
export type NextStepValues = typeof NextStep[NextStepKeys];

export const NextEditStep = {
  [CurrentlyRegisteringOrder.DELIVERY_TYPE]: CurrentlyRegisteringOrder.DELIVERY_FEE,
  [CurrentlyRegisteringOrder.PAYMENT_METHOD]: CurrentlyRegisteringOrder.FINISHED,
  [CurrentlyRegisteringOrder.ADDRESS]: CurrentlyRegisteringOrder.DELIVERY_FEE,
  [CurrentlyRegisteringOrder.DELIVERY_FEE]: CurrentlyRegisteringOrder.FINISHED,
  [CurrentlyRegisteringOrder.COMMENTS]: CurrentlyRegisteringOrder.FINISHED,
  // [CurrentlyRegisteringOrder.COUPOM]: CurrentlyRegisteringOrder.FINISHED,

}

export type NextEditStepKeys = keyof typeof NextEditStep;
export type NextEditStepValues = typeof NextEditStep[NextEditStepKeys];

