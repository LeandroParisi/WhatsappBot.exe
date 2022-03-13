export enum DeliveryTypeTranslation {
  delivery = 'Entrega',
  counter_pickup = 'Retirada no balcão',
  on_spot_consumption = 'Consumo no local',
}

export const DeliveryTypes = {
  1: DeliveryTypeTranslation.delivery,
  2: DeliveryTypeTranslation.counter_pickup,
  3: DeliveryTypeTranslation.on_spot_consumption,
} as const

export type DeliveryTypesKeys = keyof typeof DeliveryTypes;
export type DeliveryTypesValues = typeof DeliveryTypes[DeliveryTypesKeys];