import DOMPurify from 'dompurify'
import { convert } from 'html-to-text'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import path from 'src/constants/path'
import productApi from 'src/apis/product.api'
import purchaseApi from 'src/apis/purchase.api'
import { purchasesStatus } from 'src/constants/purchase'
import ProductRating from 'src/components/ProductRating'
import Product from 'src/pages/ProductList/components/Product'
import QuantityController from 'src/components/QuantityController'
import { ProductListConfig, Product as ProductType } from 'src/types/product.type'
import { rateSale, formatCurrency, getIdFromNameId, formatNumberToSocialStyle } from 'src/utils/utils'

export default function ProductDetail() {
    const { t } = useTranslation('product')
    const [buyCount, setBuyCount] = useState(1)
    const [activeImage, setActiveImage] = useState('')
    const navigate = useNavigate()
    const imageRef = useRef<HTMLImageElement>(null)

    const queryClient = useQueryClient()

    const { nameId } = useParams()

    const id = getIdFromNameId(nameId as string)
    const { data: productDetailData } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getProductDetail(id as string)
    })
    const product = productDetailData?.data.data

    const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
    const currentImages = useMemo(
        () => (product ? product.images.slice(...currentIndexImages) : []),
        [product, currentIndexImages]
    )

    const queryConfig: ProductListConfig = {
        page: '1',
        limit: '20',
        category: product?.category._id
    }

    const { data: productsData } = useQuery({
        queryKey: ['products', queryConfig],
        queryFn: () => {
            return productApi.getProducts(queryConfig)
        },
        staleTime: 3 * 60 * 1000,
        enabled: Boolean(product)
    })

    useEffect(() => {
        if (product && product.images.length > 0) {
            setActiveImage(product.images[0])
        }
    }, [product])

    const next = () => {
        if (currentIndexImages[1] < (product as ProductType).images.length) {
            setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
        }
    }

    const prev = () => {
        if (currentIndexImages[0] > 0) {
            setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
        }
    }

    const chooseActive = (img: string) => {
        setActiveImage(img)
    }

    const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const image = imageRef.current as HTMLImageElement
        const { naturalHeight, naturalWidth } = image
        const offsetX = event.pageX - (rect.x + window.scrollX)
        const offsetY = event.pageY - (rect.y + window.scrollY)

        const top = offsetY * (1 - naturalHeight / rect.height)
        const left = offsetX * (1 - naturalWidth / rect.width)
        image.style.width = naturalWidth + 'px'
        image.style.height = naturalHeight + 'px'
        image.style.maxWidth = 'unset'
        image.style.top = top + 'px'
        image.style.left = left + 'px'
    }

    const handleExitZoom = () => {
        imageRef.current?.removeAttribute('style')
    }

    const handleBuyCount = (value: number) => {
        setBuyCount(value)
    }

    const addToCartMutation = useMutation(purchaseApi.addToCart)
    const addToCart = () => {
        addToCartMutation.mutate(
            { buy_count: buyCount, product_id: product?._id as string },
            {
                onSuccess: (data) => {
                    toast.success(data.data.message, { autoClose: 1000 })
                    queryClient.invalidateQueries({
                        queryKey: ['purchases', { status: purchasesStatus.inCart }]
                    })
                }
            }
        )
    }

    const buyNow = async () => {
        const res = await addToCartMutation.mutateAsync({
            buy_count: buyCount,
            product_id: product?._id as string
        })
        const purchase = res.data.data
        navigate(path.cart, {
            state: {
                purchaseId: purchase._id
            }
        })
    }

    if (!product) return null
    return (
        <div className='bg-neutral-100 pt-6'>
            <Helmet>
                <title>{product.name} | Shopee Việt Nam</title>
                <meta
                    name='description'
                    content={convert(product.description, {
                        limits: {
                            maxInputLength: 150
                        }
                    })}
                />
            </Helmet>
            <div className='container'>
                <div className='bg-white p-5 shadow xs:p-3'>
                    <div className='grid grid-cols-12 gap-5'>
                        <div className='col-span-5 xs:col-span-12'>
                            <div
                                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                                onMouseMove={handleZoom}
                                onMouseLeave={handleExitZoom}
                            >
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className='absolute left-0 top-0 h-full w-full bg-white object-cover'
                                    ref={imageRef}
                                />
                            </div>
                            <div className='relative mt-4 grid grid-cols-5 gap-1'>
                                <button
                                    className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                                    onClick={prev}
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth={1.5}
                                        stroke='currentColor'
                                        className='h-5 w-5'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M15.75 19.5L8.25 12l7.5-7.5'
                                        />
                                    </svg>
                                </button>
                                {currentImages.map((img) => {
                                    const isActive = img === activeImage
                                    return (
                                        <div
                                            className='relative w-full pt-[100%]'
                                            key={img}
                                            onMouseEnter={() => chooseActive(img)}
                                        >
                                            <img
                                                src={img}
                                                alt={product.name}
                                                className='absolute left-0 top-0 h-full w-full cursor-pointer bg-white object-cover'
                                            />
                                            {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                                        </div>
                                    )
                                })}
                                <button
                                    className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                                    onClick={next}
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth={1.5}
                                        stroke='currentColor'
                                        className='h-5 w-5'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M8.25 4.5l7.5 7.5-7.5 7.5'
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className='relative col-span-7 xs:col-span-12'>
                            <h1 className='text-xl font-medium uppercase xs:line-clamp-2'>{product.name}</h1>
                            <div className='mt-7 flex items-center'>
                                <div className='flex items-center'>
                                    <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                                    <ProductRating
                                        rating={product.rating}
                                        activeClassname='fill-orange text-orange h-4 w-4'
                                        nonActiveClassname='fill-gray-300 text-gray-300 h-4 w-4'
                                    />
                                </div>
                                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                                <div>
                                    <span>{formatNumberToSocialStyle(product.sold)}</span>
                                    <span className='ml-1 text-gray-500'>{t('sold')}</span>
                                </div>
                            </div>
                            <div className='mt-7 flex flex-wrap items-center gap-2 bg-gray-50 px-5 py-4'>
                                <span className='text-gray-500 line-through'>
                                    ₫{formatCurrency(product.price_before_discount)}
                                </span>
                                <span className='text-3xl font-medium text-orange'>
                                    ₫{formatCurrency(product.price)}
                                </span>
                                <span className='rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                                    {rateSale(product.price_before_discount, product.price)} {t('off')}
                                </span>
                            </div>
                            <div className='mt-8 flex flex-wrap items-center gap-4'>
                                <div className='flex items-center'>
                                    <div className='capitalize text-gray-500'>{t('quantity')}</div>
                                    <QuantityController
                                        value={buyCount}
                                        max={product.quantity}
                                        onType={handleBuyCount}
                                        onIncrease={handleBuyCount}
                                        onDecrease={handleBuyCount}
                                    />
                                </div>
                                <div className='text-gray-500'>
                                    {product.quantity}
                                    <span className='ml-1'>{t('available')}</span>
                                </div>
                            </div>
                            <div className='mt-7 flex items-center'>
                                <button
                                    onClick={addToCart}
                                    className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5 xs:px-2'
                                >
                                    <svg
                                        enableBackground='new 0 0 15 15'
                                        viewBox='0 0 15 15'
                                        x={0}
                                        y={0}
                                        className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange xs:hidden'
                                    >
                                        <g>
                                            <g>
                                                <polyline
                                                    fill='none'
                                                    points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeMiterlimit={10}
                                                />
                                                <circle cx={6} cy='13.5' r={1} stroke='none' />
                                                <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                                            </g>
                                            <line
                                                fill='none'
                                                strokeLinecap='round'
                                                strokeMiterlimit={10}
                                                x1='7.5'
                                                x2='10.5'
                                                y1={7}
                                                y2={7}
                                            />
                                            <line
                                                fill='none'
                                                strokeLinecap='round'
                                                strokeMiterlimit={10}
                                                x1={9}
                                                x2={9}
                                                y1='8.5'
                                                y2='5.5'
                                            />
                                        </g>
                                    </svg>
                                    {t('addToCart')}
                                </button>
                                <button
                                    onClick={buyNow}
                                    className='fkex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                                >
                                    {t('buyNow')}
                                </button>
                            </div>
                            <div className='absolute bottom-0 left-0 hidden w-full lg:block '>
                                <div className='mt-8 h-[1px] w-full bg-slate-100'></div>
                                <div className='flex items-center py-4 pl-2'>
                                    <img
                                        src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/83e10a1f95cb083579c0.png'
                                        alt='scurity'
                                        className='h-4 w-4'
                                    />
                                    <span className='ml-1 mr-6 text-sm capitalize'>{t('guarantee')}</span>
                                    <span className='text-sm text-gray-400'>{t('return policy')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-8'>
                <div className='container'>
                    <div className=' bg-white p-4 shadow'>
                        <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>
                            {t('product description')}
                        </div>
                        <div className='m-4 text-sm leading-loose'>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(product.description)
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-8'>
                <div className='container'>
                    <div className='uppercase text-gray-400'>{t('may like')}</div>
                    {productsData && (
                        <div className='mt-6 grid gap-3 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
                            {productsData.data.data.products.map((product) => (
                                <div className='col-span-1' key={product._id}>
                                    <Product product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
