import { Promotion, Product, Attribute, AttributeTypes } from "../../data/Interfaces/BranchData";
import staticImplements from "../../Shared/Anotations/staticImplements";

@staticImplements()
export default class BranchDataUtils {
  static GeneratePromotionsMessage(promotions : Promotion[]) : string {
    const message = promotions.map((promotion : Promotion, promoIndex : number) => {
      const promotionMessage =  `*${promoIndex + 1}. ${promotion.name}* - R$ ${promotion.totalPrice}:
      \n*Produtos:*`

      const formattedProduct = promotion.promotionProducts.map((product : Product) => {
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

      return promotionMessage + formattedProduct
    }).join("\n---\n\n")

    return message
  }
}