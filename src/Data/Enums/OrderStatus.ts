export const OrderStatus = {
  PLACED: 1,
  IN_PRODUCTION: 2,
  DISPATCHED: 3,
  FULLFILLED: 4,
} as const

export type OrderStatusKeys = keyof typeof OrderStatus;
export type OrderStatusValues = typeof OrderStatus[OrderStatusKeys];

export const StatusTranslations = {
  1: "Solicitado",
  2: "Em produção",
  3: "Enviado para entrega",
  4: "Entregue"
}