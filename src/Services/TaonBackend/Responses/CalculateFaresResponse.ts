
export default interface CalculateFaresResponse {
  data : CalculatedFares
}

export interface CalculatedFares {
  estimatedDeliveryDuration: number,
  deliveryFee: number,
  subTotal: number,
  totalPrice: number,
  distanceInKm : number
}
