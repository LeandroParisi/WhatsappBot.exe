export enum DeliveryTypeTranslation {
  delivery = 'Entrega',
  counter_pickup = 'Retirada no balcão',
  on_spot_consumption = 'Consumo no local',
}

export default class DeliveryTypeUtils {
  static TranslateToPt(deliveryType : keyof typeof DeliveryTypeTranslation) : string {
    return DeliveryTypeTranslation[deliveryType]
  }
}