
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

export default class PaymentMethodsUtils {
  static TranslateToPt(paymentMethod : keyof typeof PaymentMethodTranslation) : string {
    return PaymentMethodTranslation[paymentMethod]
  }
}