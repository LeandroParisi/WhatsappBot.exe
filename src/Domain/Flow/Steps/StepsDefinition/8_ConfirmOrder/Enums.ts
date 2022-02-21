
export enum OrderConfirmationAnswers {
  OK = "OK",
  CANCELAR = 'CANCELAR'
}

export interface ValidationPayload {
  isValid : boolean
  selectedOption? : OrderConfirmationPossibleEditsValues | OrderConfirmationAnswers
}

export const OrderConfirmationOptions = {
  promotion: 1,
  deliveryType: 2,
  paymentMethod: 3,
  address: 4,
  comment: 5,
  subTotal: 6,
  deliveryFee: 7,
  totalPrice: 8,
} as const


export type OrderConfirmationOptionsKeys = keyof typeof OrderConfirmationOptions;
export type OrderConfirmationOptionsValues = typeof OrderConfirmationOptions[OrderConfirmationOptionsKeys];


export const OrderConfirmationPossibleEdits = {
  deliveryType: OrderConfirmationOptions.deliveryType,
  paymentMethod: OrderConfirmationOptions.paymentMethod,
  address: OrderConfirmationOptions.address,
  comment: OrderConfirmationOptions.comment,
} as const


export type OrderConfirmationPossibleEditsKeys = keyof typeof OrderConfirmationPossibleEdits;
export type OrderConfirmationPossibleEditsValues = typeof OrderConfirmationPossibleEdits[OrderConfirmationPossibleEditsKeys];


export const OrderOptionsTranslation = {
  [OrderConfirmationOptions.promotion]: 'Promoção',
  [OrderConfirmationOptions.deliveryType]: 'Tipo de entrega',
  [OrderConfirmationOptions.paymentMethod]: 'Método de pagamento',
  [OrderConfirmationOptions.address]: 'Endereço',
  [OrderConfirmationOptions.comment]: 'Comentário',
  [OrderConfirmationOptions.subTotal]: 'Sub Total',
  [OrderConfirmationOptions.deliveryFee]: 'Taxa de entrega',
  [OrderConfirmationOptions.totalPrice]: 'Total',
}
