import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import path from 'src/constants/path'
import ProductRating from 'src/components/ProductRating'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from 'src/utils/utils'

interface Props {
    product: ProductType
}

const Product = ({ product }: Props) => {
    const { t } = useTranslation('product')
    return (
        <Link to={`${path.product}${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
            <div className='relative rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.0625rem] hover:shadow-md'>
                <div className='relative w-full pt-[100%]'>
                    <img
                        src={product.image}
                        alt={product.name}
                        className='absolute left-0 top-0 h-full w-full bg-white object-cover'
                    ></img>
                </div>
                <div className='overflow-hidden p-2 text-sm'>
                    <div className='line-clamp-2 xs:text-lg sm:text-lg md:text-sm'>{product.name}</div>
                    <div className='mt-3 flex items-center gap-2'>
                        <span className='text-orange xs:text-lg sm:text-lg md:text-base'>
                            ₫{formatCurrency(product.price)}
                        </span>
                        <span className='max-w-[50] truncate text-gray-400 line-through xs:text-sm sm:text-base md:text-xs'>
                            ₫{formatCurrency(product.price_before_discount)}
                        </span>
                    </div>
                    <div className='mt-3 flex items-center justify-end'>
                        <ProductRating rating={product.rating} />
                        <div className='ml-2 flex items-center gap-1 text-sm xs:text-xs '>
                            <span>{formatNumberToSocialStyle(product.sold)}</span>
                            <span className='xs:line-clamp-1'>{t('sold')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Product
