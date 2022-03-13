import { PaymentMethods, PaymentMethodsKeys, PaymentMethodTranslation } from "../../../data/Enums/PaymentMethods"


export default class PaymentMethodsUtils {
  static TranslateToPt(paymentMethod : keyof typeof PaymentMethodTranslation) : string {
    return PaymentMethodTranslation[paymentMethod]
  }

  static TranslateToPtFromNumber(paymentMethodId : PaymentMethodsKeys) : string {
    return PaymentMethods[paymentMethodId]
  }
}