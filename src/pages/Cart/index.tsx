// eslint-disable-next-line import/no-named-as-default
import produce from 'immer'
import keyBy from 'lodash/keyBy'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { useContext, useEffect, useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import path from 'src/constants/path'
import { images } from 'src/assets/images'
import Button from 'src/components/Button'
import productApi from 'src/apis/product.api'
import purchaseApi from 'src/apis/purchase.api'
import { Purchase } from 'src/types/purchase.type'
import { AppContext } from 'src/contexts/app.context'
import { purchasesStatus } from 'src/constants/purchase'
import Product from 'src/pages/ProductList/components/Product'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import QuantityController from 'src/components/QuantityController'

const Cart = () => {
    const { t } = useTranslation('cart')
    const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
    const location = useLocation()
    const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId

    // Data Product
    const { data: productsList } = useQuery({
        queryKey: ['products'],
        queryFn: () => productApi.getProducts()
    })

    // Data Purchases
    const {
        data: purchasesInCartData,
        refetch: refetchPurchases,
        isLoading
    } = useQuery({
        queryKey: ['purchases', { status: purchasesStatus.inCart }],
        queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
    })
    const purchasesInCart = purchasesInCartData?.data.data

    const updatePurchaseMutation = useMutation({
        mutationFn: purchaseApi.updatePurchase,
        onSuccess: () => {
            refetchPurchases()
        }
    })

    const deletePurchasesMutation = useMutation({
        mutationFn: purchaseApi.deletePurchase,
        onSuccess: () => {
            refetchPurchases()
        }
    })

    const buyProductsMutation = useMutation({
        mutationFn: purchaseApi.buyProducts,
        onSuccess: (data) => {
            refetchPurchases()
            toast.success(data.data.message, {
                position: 'top-center',
                autoClose: 1000
            })
        }
    })

    const handleBuyPurchases = () => {
        if (checkedPurchases.length > 0) {
            const body = checkedPurchases.map((purchase) => ({
                product_id: purchase.product._id,
                buy_count: purchase.buy_count
            }))
            buyProductsMutation.mutate(body)
        }
    }

    useEffect(() => {
        setExtendedPurchases((prev) => {
            const extendedPurchasesObject = keyBy(prev, '_id')
            return (
                purchasesInCart?.map((purchase) => {
                    const isChoosenPurchaseFromLocation = choosenPurchaseIdFromLocation === purchase._id
                    return {
                        ...purchase,
                        disabled: false,
                        checked:
                            isChoosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
                    }
                }) || []
            )
        })
    }, [purchasesInCart, choosenPurchaseIdFromLocation, setExtendedPurchases])

    useEffect(() => {
        return () => {
            history.replaceState(null, '')
        }
    }, [])

    const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
    const checkedPurchases = useMemo(
        () => extendedPurchases.filter((purchase) => purchase.checked),
        [extendedPurchases]
    )
    const checkedPurchasesCount = checkedPurchases.length
    const totalCheckedPurchasePrice = useMemo(
        () =>
            checkedPurchases.reduce((sum, item) => {
                return sum + item.product.price * item.buy_count
            }, 0),
        [checkedPurchases]
    )

    const totalCheckedPurchaseSaved = useMemo(() => {
        const oldTotalPrice = checkedPurchases.reduce((sum, item) => {
            return sum + item.product.price_before_discount * item.buy_count
        }, 0)
        return oldTotalPrice - totalCheckedPurchasePrice
    }, [checkedPurchases, totalCheckedPurchasePrice])

    // Handler
    const handleCheched = (productIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setExtendedPurchases(
            produce((draft) => {
                draft[productIndex].checked = event.target.checked
            })
        )
    }
    const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked
        setExtendedPurchases((prevPurchases) => {
            return prevPurchases?.map((purchase) => ({ ...purchase, checked }))
        })
    }

    const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
        setExtendedPurchases(
            produce((draft) => {
                draft[purchaseIndex].buy_count = value
            })
        )
    }

    const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
        if (enable) {
            const purchase = extendedPurchases[purchaseIndex]
            setExtendedPurchases(
                produce((draft) => {
                    draft[purchaseIndex].disabled = true
                })
            )
            updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
        }
    }

    const handleDelete = (purchaseIndex: number) => () => {
        const purchaseId = extendedPurchases[purchaseIndex]._id
        deletePurchasesMutation.mutate([purchaseId])
    }

    const handleDeleteManyPurchases = () => {
        const purchasesIds = checkedPurchases.map((purchase) => purchase._id)
        deletePurchasesMutation.mutate(purchasesIds)
    }

    return (
        <div className='bg-neutral-100 pt-6'>
            <Helmet>
                <title>{t('domainCart')}</title>
                <meta name='description' content={t('domainCart')} />
            </Helmet>
            <div className='container'>
                {purchasesInCart && purchasesInCart.length > 0 && (
                    <>
                        <div className='overflow-auto'>
                            <div className='min-w-[1000px]'>
                                <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
                                    <div className='col-span-6'>
                                        <div className='flex items-center'>
                                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                                                <input
                                                    type='checkbox'
                                                    checked={isAllChecked}
                                                    onChange={handleCheckAll}
                                                    className='h-5 w-5 accent-orange'
                                                />
                                            </div>
                                            <div className='flex-grow text-black'>{t('product')}</div>
                                        </div>
                                    </div>
                                    <div className='col-span-6'>
                                        <div className='grid grid-cols-5 text-center'>
                                            <div className='col-span-2'>{t('price')}</div>
                                            <div className='col-span-1'>{t('quantity')}</div>
                                            <div className='col-span-1'>{t('totalPrice')}</div>
                                            <div className='col-span-1'>{t('actions')}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='my-3 rounded-sm bg-white p-5 shadow'>
                                    {extendedPurchases.map((purchase, index) => (
                                        <div
                                            key={purchase._id}
                                            className='mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'
                                        >
                                            <div className='col-span-6'>
                                                <div className='flex'>
                                                    <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                                                        <input
                                                            type='checkbox'
                                                            className='h-5 w-5 accent-orange'
                                                            checked={purchase.checked}
                                                            onChange={handleCheched(index)}
                                                        />
                                                    </div>
                                                    <div className='flex-grow'>
                                                        <div className='flex'>
                                                            <Link
                                                                className='h-20 w-20 flex-shrink-0'
                                                                to={`${path.home}${generateNameId({
                                                                    name: purchase.product.name,
                                                                    id: purchase.product._id
                                                                })}`}
                                                            >
                                                                <img
                                                                    alt={purchase.product.name}
                                                                    src={purchase.product.image}
                                                                />
                                                            </Link>
                                                            <div className='flex-grow px-2 pb-2 pt-1'>
                                                                <Link
                                                                    to={`${path.home}${generateNameId({
                                                                        name: purchase.product.name,
                                                                        id: purchase.product._id
                                                                    })}`}
                                                                    className='line-clamp-2 text-left'
                                                                >
                                                                    {purchase.product.name}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-span-6'>
                                                <div className='grid grid-cols-5 items-center'>
                                                    <div className='col-span-2'>
                                                        <div className='flex items-center justify-center'>
                                                            <span className='text-gray-300 line-through'>
                                                                ₫
                                                                {formatCurrency(purchase.product.price_before_discount)}
                                                            </span>
                                                            <span className='ml-3 text-gray-700'>
                                                                ₫{formatCurrency(purchase.product.price)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='col-span-1'>
                                                        <QuantityController
                                                            classNameWrapper='ml-0'
                                                            value={purchase.buy_count}
                                                            max={purchase.product.quantity}
                                                            onIncrease={(value) =>
                                                                handleQuantity(
                                                                    index,
                                                                    value,
                                                                    value <= purchase.product.quantity
                                                                )
                                                            }
                                                            onDecrease={(value) =>
                                                                handleQuantity(index, value, value >= 1)
                                                            }
                                                            onType={handleTypeQuantity(index)}
                                                            onFocusOut={(value) =>
                                                                handleQuantity(
                                                                    index,
                                                                    value,
                                                                    value >= 1 &&
                                                                        value <= purchase.product.quantity &&
                                                                        value !==
                                                                            (purchasesInCart as Purchase[])[index]
                                                                                .buy_count
                                                                )
                                                            }
                                                            disabled={purchase.disabled}
                                                        />
                                                    </div>
                                                    <div className='col-span-1'>
                                                        <span className='text-orange'>
                                                            ₫
                                                            {formatCurrency(
                                                                purchase.product.price * purchase.buy_count
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className='col-span-1'>
                                                        <button
                                                            onClick={handleDelete(index)}
                                                            className='bg-none text-black transition-colors hover:text-orange'
                                                        >
                                                            {t('btnDelete')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='sticky bottom-0 z-10 mt-2 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center'>
                            <div className='flex items-center'>
                                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                                    <input
                                        type='checkbox'
                                        onChange={handleCheckAll}
                                        checked={isAllChecked}
                                        className='h-5 w-5 accent-orange'
                                    />
                                </div>
                                <button className='mx-3 border-none bg-none'>
                                    {t('selectAll')} ({extendedPurchases.length})
                                </button>
                                <button onClick={handleDeleteManyPurchases} className='mx-3 border-none bg-none'>
                                    {t('btnDelete')}
                                </button>
                            </div>

                            <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                                <div>
                                    <div className='flex flex-wrap items-center sm:justify-end'>
                                        <span>
                                            {t('total')} ({checkedPurchasesCount} {t('item')}):
                                        </span>
                                        <span className='ml-2 text-2xl text-orange'>
                                            ₫{formatCurrency(totalCheckedPurchasePrice)}
                                        </span>
                                    </div>
                                    <div className='flex items-center text-sm sm:justify-end'>
                                        {checkedPurchasesCount > 0 && (
                                            <>
                                                <span>{t('saved')}</span>
                                                <span className='ml-6 text-orange'>
                                                    ₫{formatCurrency(totalCheckedPurchaseSaved)}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    onClick={handleBuyPurchases}
                                    className='mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 xs:w-full sm:ml-4 sm:mt-0'
                                >
                                    {t('buy')}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
                {!isLoading && purchasesInCart?.length === 0 && (
                    <div className='flex h-[336px] flex-col items-center justify-center text-center'>
                        <img src={images.noOrderCart} alt='no purchase' className='mx-auto h-24 w-24' />
                        <div className='mt-5 font-bold text-gray-400'>{t('noCart')}</div>
                        <div className='mt-5 text-center'>
                            <Link
                                to={path.home}
                                className=' rounded-sm bg-orange px-10 py-2  uppercase text-white transition-all hover:bg-orange/80'
                            >
                                {t('buyNow')}
                            </Link>
                        </div>
                    </div>
                )}
                <div className='mt-14'>
                    <div className='uppercase text-gray-400'>{t('mayLike')}</div>
                    {productsList && (
                        <div className='mt-6 grid gap-3 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
                            {productsList.data.data.products.slice(0, 12).map((product) => (
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

export default Cart
