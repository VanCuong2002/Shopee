import { Product } from 'src/types/product.type'
/*
    -1: Sản phẩm đang trong giỏ hàng
    0: Tất cả sản phẩm
    1: Sản phẩm đang đợi xác nhận từ chủ shop
    2: Sản phẩm đang được lấy hàng
    3: Sản phẩm đang vận chuyển
    4: San phẩm đã được giao
    5: Sản phẩm đã bị hủy
 */
export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5
export type PurchaseListStatus = PurchaseStatus | 0
export interface Purchase {
    _id: string
    buy_count: number
    price: number
    price_before_discount: number
    status: PurchaseStatus
    user: string
    product: Product
    createdAt: string
    updatedAt: string
}
export interface ExtendedPurchase extends Purchase {
    disabled: boolean
    checked: boolean
}
