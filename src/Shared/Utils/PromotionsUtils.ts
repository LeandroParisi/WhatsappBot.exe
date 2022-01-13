import { Attribute, AttributeTypes, Product, Promotion } from "../../data/Interfaces/BranchData";

export interface PromotionMessage {
  promoInfo : string
  productInfo : string
}

export default class PromotionsUtils {
  public static GetAvaiablePromotions (promotions : Promotion[], currentDay : number) {
    return promotions.filter((promotion : Promotion) => new Set([...promotion.avaiability]).has(currentDay))
  }

  public static ParsePromotionToText(promotion : Promotion) : PromotionMessage {
    const promoInfo =  `*${promotion.name}* - R$ ${promotion.totalPrice}:
    \n*Produtos:*`

    const productInfo = promotion.promotionProducts.map((product : Product) => {
      const formattedAttributes = product.attributes
        .map((a : Attribute) => {
          if (a.type === AttributeTypes.sizes) {
            return `${a.name}`
          } else {
            return `${a.name} - ${a.quantity}un`
          }
        })
        .join(", ")

      return `\n${product.name}${!!product.attributes.length ? " -> " : ""}${formattedAttributes}`
    }).join("\n")

    return {
      promoInfo,      
      productInfo
    }

  }
}