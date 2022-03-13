import { DeliveryTypes, DeliveryTypesKeys, DeliveryTypeTranslation } from "../../Data/Enums/DeliveryTypes"


export default class DeliveryTypeUtils {
  static TranslateToPt(deliveryType : keyof typeof DeliveryTypeTranslation) : string {
    return DeliveryTypeTranslation[deliveryType]
  }

  static TranslateToPtFromNumber(deliveryTypeId : DeliveryTypesKeys) : string {
    return DeliveryTypes[deliveryTypeId]
  }
}