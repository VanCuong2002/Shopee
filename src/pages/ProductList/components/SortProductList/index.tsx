import omit from 'lodash/omit'
import { useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Link, createSearchParams, useLocation, useNavigate } from 'react-router-dom'

import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'
import { orderConstant, sortByConstant } from 'src/constants/product'
import { images } from 'src/assets/images'

interface Props {
    pageSize: number
    queryConfig: QueryConfig
}

const SortProductList = ({ queryConfig, pageSize }: Props) => {
    const { t } = useTranslation('home')
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const orderParam = queryParams.get('order')

    const [showSelectPrice, setShowSelectPrice] = useState(false)
    const [priceOrder, setPriceOrder] = useState(orderParam || undefined)

    const navigate = useNavigate()
    const pageCurrent = Number(queryConfig.page)
    const { sort_by = sortByConstant.createdAt } = queryConfig

    const getSortButtonClass = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) =>
        classNames('h-[34px] px-4 capitalize text-sm text-center', {
            'bg-orange hover:bg-orange/90 text-white': isActiveSortBy(sortByValue),
            'bg-white hover:bg-white/70': !isActiveSortBy(sortByValue)
        })

    const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => sort_by === sortByValue

    const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
        setPriceOrder(undefined)
        navigate({
            pathname: path.home,
            search: createSearchParams(
                omit(
                    {
                        ...queryConfig,
                        sort_by: sortByValue
                    },
                    ['order']
                )
            ).toString()
        })
    }

    const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
        setPriceOrder(orderValue)

        navigate({
            pathname: path.home,
            search: createSearchParams({
                ...queryConfig,
                sort_by: sortByConstant.price,
                order: orderValue
            }).toString()
        })
    }

    return (
        <div className='flex flex-wrap items-center justify-between gap-2 bg-gray-300/40 px-3 py-4'>
            <div className='flex flex-wrap items-center justify-start gap-2 xs:grid xs:flex-1 xs:grid-cols-2'>
                <div>{t('sort by.title')}</div>
                <button
                    onClick={() => handleSort(sortByConstant.view)}
                    className={getSortButtonClass(sortByConstant.view)}
                >
                    {t('sort by.view')}
                </button>
                <button
                    onClick={() => handleSort(sortByConstant.createdAt)}
                    className={getSortButtonClass(sortByConstant.createdAt)}
                >
                    {t('sort by.createdAt')}
                </button>
                <button
                    onClick={() => handleSort(sortByConstant.sold)}
                    className={getSortButtonClass(sortByConstant.sold)}
                >
                    {t('sort by.sold')}
                </button>
                <div className='relative'>
                    <button
                        onMouseEnter={() => setShowSelectPrice(true)}
                        onMouseLeave={() => setShowSelectPrice(false)}
                        className={classNames(
                            'flex h-[34px] w-44 items-center justify-between bg-white px-3 text-sm capitalize hover:bg-white/70 xs:w-full'
                        )}
                    >
                        <span className={priceOrder ? 'text-orange' : ''}>
                            {priceOrder === orderConstant.asc
                                ? `${t('sort by.priceAsc')}`
                                : priceOrder === orderConstant.desc
                                ? `${t('sort by.priceDesc')}`
                                : `${t('sort by.price')}`}
                        </span>

                        <svg viewBox='0 0 12 12' fill='none' width='12' height='12' color='currentColor'>
                            <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M6 8.146L11.146 3l.707.707-5.146 5.147a1 1 0 01-1.414 0L.146 3.707.854 3 6 8.146z'
                                fill='currentColor'
                            ></path>
                        </svg>
                    </button>
                    <div
                        onMouseEnter={() => setShowSelectPrice(true)}
                        onMouseLeave={() => setShowSelectPrice(false)}
                        className={classNames('absolute left-0 top-full z-10 w-full bg-white text-sm shadow-2xl', {
                            hidden: !showSelectPrice
                        })}
                    >
                        <button
                            onClick={() => handlePriceOrder(orderConstant.asc)}
                            className='xs:w-full" flex h-[34px] w-44 items-center justify-between bg-white px-3 text-sm capitalize hover:bg-white/70'
                        >
                            {t('sort by.priceAsc')}
                            {priceOrder === orderConstant.asc && (
                                <img src={images.isActiveChevronDown} alt='active chevron-down' />
                            )}
                        </button>
                        <button
                            onClick={() => handlePriceOrder(orderConstant.desc)}
                            className='xs:w-full" flex h-[34px] w-44 items-center justify-between bg-white px-3 text-sm capitalize hover:bg-white/70'
                        >
                            {t('sort by.priceDesc')}
                            {priceOrder === orderConstant.desc && (
                                <img src={images.isActiveChevronDown} alt='active chevron-down' />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex items-center xs:hidden sm:hidden lg:flex'>
                <div className='text-sm'>
                    <span className='text-orange'>{pageCurrent}</span>
                    <span>/{pageSize}</span>
                </div>
                <div className='ml-2 flex items-center justify-center'>
                    {pageCurrent === 1 ? (
                        <span className='flex h-[34px] cursor-not-allowed items-center justify-center rounded-bl-sm rounded-tl-sm bg-white px-2 shadow'>
                            <img src={images.chevronLeft} alt='active chevron-left' />
                        </span>
                    ) : (
                        <Link
                            to={{
                                pathname: path.home,
                                search: createSearchParams({
                                    ...queryConfig,
                                    page: (pageCurrent - 1).toString()
                                }).toString()
                            }}
                            className='flex h-[34px] items-center justify-center rounded-bl-sm rounded-tl-sm bg-white px-2 shadow'
                        >
                            <img src={images.chevronLeft} alt='active chevron-left' />
                        </Link>
                    )}
                    {pageCurrent === pageSize ? (
                        <span className='flex h-[34px] cursor-not-allowed items-center justify-center rounded-bl-sm rounded-tl-sm bg-white px-2 shadow'>
                            <img src={images.chevronRight} alt='active chevron-righ' />
                        </span>
                    ) : (
                        <Link
                            to={{
                                pathname: path.home,
                                search: createSearchParams({
                                    ...queryConfig,
                                    page: (pageCurrent + 1).toString()
                                }).toString()
                            }}
                            className='flex h-[34px] items-center justify-center rounded-bl-sm rounded-tl-sm bg-gray-200 px-2 shadow hover:bg-slate-100'
                        >
                            <img src={images.chevronRight} alt='active chevron-righ' />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SortProductList
