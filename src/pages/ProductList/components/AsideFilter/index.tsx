import omit from 'lodash/omit'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'

import path from 'src/constants/path'
import Button from 'src/components/Button'
import { Schema, schema } from 'src/utils/rules'
import { Category } from 'src/types/category.type'
import InputNumber from 'src/components/InputNumber'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { NoUndefinedField } from 'src/types/utils.type'
import RatingStars from 'src/pages/ProductList/components/RatingStars'

interface Props {
    categories: Category[]
    queryConfig: QueryConfig
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>

const priceSchema = schema.pick(['price_min', 'price_max'])

const AsideFilter = ({ queryConfig, categories }: Props) => {
    const { t } = useTranslation('home')
    const navigate = useNavigate()
    const { category } = queryConfig
    const {
        reset,
        trigger,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            price_min: '',
            price_max: ''
        },
        resolver: yupResolver(priceSchema)
    })

    const onSubmit = handleSubmit((data) => {
        navigate({
            pathname: path.home,
            search: createSearchParams({
                ...queryConfig,
                page: '1',
                price_min: data.price_min,
                price_max: data.price_max
            }).toString()
        })
    })

    const handleRemoveAll = () => {
        reset()
        navigate({
            pathname: path.home,
            search: createSearchParams(
                omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])
            ).toString()
        })
    }

    return (
        <div className='py-4 text-sm'>
            <Link to={path.home} className='flex items-center font-bold'>
                <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
                    <g fillRule='evenodd' stroke='none' strokeWidth={1}>
                        <g transform='translate(-373 -208)'>
                            <g transform='translate(155 191)'>
                                <g transform='translate(218 17)'>
                                    <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                                    <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                                    <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
                <span className='text-base'>{t('aside filter.all categories')}</span>
            </Link>
            <div className='my-4 h-[1px] bg-gray-300' />
            <ul>
                {categories.map((categoryItem) => {
                    const isActive = category === categoryItem._id
                    return (
                        <li className='py-2 pl-3' key={categoryItem._id}>
                            <Link
                                to={{
                                    pathname: path.home,
                                    search: createSearchParams(
                                        omit(
                                            {
                                                ...queryConfig,
                                                page: '1',
                                                category: categoryItem._id
                                            },
                                            ['name']
                                        )
                                    ).toString()
                                }}
                                className={isActive ? 'relative px-2 font-semibold text-orange' : ''}
                            >
                                {isActive && (
                                    <svg viewBox='0 0 4 7' className='absolute left-[-10px] top-1 h-2 w-2 fill-orange'>
                                        <polygon points='4 3.5 0 0 0 7' />
                                    </svg>
                                )}
                                {categoryItem.name}
                            </Link>
                        </li>
                    )
                })}
            </ul>
            <Link to={path.home} className='mt-4 flex items-center font-bold uppercase'>
                <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-3 h-4 w-3 fill-current stroke-current'
                >
                    <g>
                        <polyline
                            fill='none'
                            points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeMiterlimit={10}
                        />
                    </g>
                </svg>
                <span className='text-base'>{t('aside filter.filter search')}</span>
            </Link>
            <div className='my-4 h-[1px] bg-gray-300' />
            <div className='my-5'>
                <div>{t('aside filter.price range')}</div>
                <form className='mt-2' onSubmit={onSubmit}>
                    <div className='flex items-start'>
                        <Controller
                            control={control}
                            name='price_min'
                            render={({ field }) => {
                                return (
                                    <InputNumber
                                        {...field}
                                        type='text'
                                        aria-label=''
                                        maxLength={13}
                                        className='grow'
                                        autoComplete='on'
                                        placeholder={`₫ ${t('aside filter.min')}`}
                                        classNameInput='p-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm text-gray-400'
                                        onChange={(event) => {
                                            field.onChange(event)
                                            trigger('price_min')
                                        }}
                                    />
                                )
                            }}
                        />

                        <div className='mx-4 mt-2 shrink-0'>-</div>
                        <Controller
                            control={control}
                            name='price_max'
                            render={({ field }) => {
                                return (
                                    <InputNumber
                                        {...field}
                                        type='text'
                                        aria-label=''
                                        maxLength={13}
                                        className='grow'
                                        autoComplete='on'
                                        placeholder={`₫ ${t('aside filter.max')}`}
                                        classNameInput='p-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm text-gray-400'
                                        onChange={(event) => {
                                            field.onChange(event)
                                            trigger('price_max')
                                        }}
                                    />
                                )
                            }}
                        />
                    </div>
                    {errors && (
                        <div className='my-1 min-h-[1.25rem] text-center text-red-500'>{errors.price_min?.message}</div>
                    )}
                    <Button className='w-full bg-orange py-2 text-white hover:bg-orange/90'>
                        {t('aside filter.apply')}
                    </Button>
                </form>
            </div>
            <div className='my-4 h-[1px] bg-gray-300' />
            <div className='my-5'>
                <div>{t('aside filter.rating')}</div>
                <RatingStars queryConfig={queryConfig} t={t} />
            </div>
            <div className='my-4 h-[1px] bg-gray-300' />
            <Button onClick={handleRemoveAll} className='w-full bg-orange py-2 uppercase text-white hover:bg-orange/90'>
                {t('aside filter.clear all')}
            </Button>
        </div>
    )
}

export default AsideFilter
