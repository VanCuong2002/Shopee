import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { createSearchParams, Link } from 'react-router-dom'

import path from 'src/constants/path'
import { images } from 'src/assets/images'
import purchaseApi from 'src/apis/purchase.api'
import useQueryParams from 'src/hooks/useQueryParams'
import { purchasesStatus } from 'src/constants/purchase'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

export default function HistoryPurchase() {
    const { t } = useTranslation('profile')
    const queryParams: { status?: string } = useQueryParams()
    const status: number = Number(queryParams.status) || purchasesStatus.all
    // console.log(queryParams, status)

    const { data: purchasesInCartData } = useQuery({
        queryKey: ['purchases', { status }],
        queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus }),
        keepPreviousData: true
    })

    const purchasesInCart = purchasesInCartData?.data.data
    console.log(purchasesInCart, status)

    const purchaseTabs = [
        { status: purchasesStatus.all, name: t('purchase.all') },
        { status: purchasesStatus.waitForConfirmation, name: t('purchase.toPay') },
        { status: purchasesStatus.waitForGetting, name: t('purchase.toShip') },
        { status: purchasesStatus.inProgress, name: t('purchase.toReceive') },
        { status: purchasesStatus.delivered, name: t('purchase.completed') },
        { status: purchasesStatus.cancelled, name: t('purchase.cancelled') }
    ]

    const purchaseTabsLink = purchaseTabs.map((tab) => (
        <Link
            key={tab.status}
            to={{
                pathname: path.historyPurchase,
                search: createSearchParams({
                    status: String(tab.status)
                }).toString()
            }}
            className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
                'border-b-orange text-orange': status === tab.status,
                'border-b-black/10 text-gray-900': status !== tab.status
            })}
        >
            {tab.name}
        </Link>
    ))

    return (
        <div>
            <div className='overflow-x-auto'>
                <div className='min-w-[700px]'>
                    <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
                    <div>
                        {purchasesInCart &&
                            purchasesInCart.length > 0 &&
                            purchasesInCart?.map((purchase) => (
                                <div
                                    key={purchase._id}
                                    className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'
                                >
                                    <Link
                                        to={`${path.home}${generateNameId({
                                            name: purchase.product.name,
                                            id: purchase.product._id
                                        })}`}
                                        className='flex'
                                    >
                                        <div className='flex-shrink-0'>
                                            <img
                                                className='h-20 w-20 object-cover'
                                                src={purchase.product.image}
                                                alt={purchase.product.name}
                                            />
                                        </div>
                                        <div className='ml-3 flex-grow overflow-hidden'>
                                            <div className='truncate'>{purchase.product.name}</div>
                                            <div className='mt-3'>x{purchase.buy_count}</div>
                                        </div>
                                        <div className='ml-3 flex-shrink-0'>
                                            <span className='truncate text-gray-500 line-through'>
                                                ₫{formatCurrency(purchase.product.price_before_discount)}
                                            </span>
                                            <span className='ml-2 truncate text-orange'>
                                                ₫{formatCurrency(purchase.product.price)}
                                            </span>
                                        </div>
                                    </Link>
                                    <div className='flex justify-end'>
                                        <div>
                                            <span>{t('purchase.totalOrder')}</span>
                                            <span className='ml-4 text-xl text-orange'>
                                                ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {purchasesInCart && purchasesInCart.length == 0 && (
                            <div className='flex h-[500px] w-full flex-col items-center justify-center bg-white'>
                                <img className='h-28 w-28' src={images.noPurchase} alt='no-order' />
                                <span className='mt-4 text-lg'>Chưa có đơn hàng</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
