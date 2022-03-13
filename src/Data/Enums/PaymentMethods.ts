
export enum PaymentMethodTranslation {
  money = 'Dinheiro',
  pix = 'Pix',
  credit = 'Cartão de crédito',
  debit = 'Cartão de débito',
  alelo_meal = 'Alelo refeição',
  alelo_food = 'Alelo alimentação',
  sodexo_meal = 'Sodexo refeição',
  sodexo_food = 'Sodexo alimentação',
}

export const PaymentMethods = {
  1: PaymentMethodTranslation.money,
  2: PaymentMethodTranslation.pix,
  3: PaymentMethodTranslation.credit,
  4: PaymentMethodTranslation.debit,
  5: PaymentMethodTranslation.alelo_meal,
  6: PaymentMethodTranslation.alelo_food,
  7: PaymentMethodTranslation.sodexo_meal,
  8: PaymentMethodTranslation.sodexo_food,
} as const

export type PaymentMethodsKeys = keyof typeof PaymentMethods;
export type PaymentMethodsValues = typeof PaymentMethods[PaymentMethodsKeys];