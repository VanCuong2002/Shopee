import range from 'lodash/range'
import classNames from 'classnames'
// eslint-disable-next-line import/named
import { TFunction } from 'i18next'
import { useEffect, useState } from 'react'

interface Props {
    value?: Date
    errorMessage?: string
    onChange?: (value: Date) => void
    t?: TFunction<'profile', undefined, 'profile'>
}

const getYearCurrent = new Date().getFullYear()

export default function DateSelect({ t, value, onChange, errorMessage }: Props) {
    const [date, setDate] = useState({
        date: value?.getDate() || 1,
        month: value?.getMonth() || 1,
        year: value?.getFullYear() || 1990
    })

    useEffect(() => {
        if (value) {
            setDate({
                date: value.getDate(),
                month: value.getMonth(),
                year: value.getFullYear()
            })
        }
    }, [value])

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value: valueFromSelect, name } = event.target
        const newDate = {
            date: value?.getDate() || date.date,
            month: value?.getMonth() || date.month,
            year: value?.getFullYear() || date.year,
            [name]: Number(valueFromSelect)
        }
        setDate(newDate)
        onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
    }

    return (
        <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t?.('account.birth')}</div>
            <div className='sm:w-[80%] sm:pl-5'>
                <div className='flex justify-between'>
                    <select
                        onChange={handleChange}
                        name='date'
                        className={classNames(
                            'h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange',
                            {
                                'rounded-sm border border-red-300 text-red-500 outline-none focus:border-red-600 focus:shadow-sm':
                                    errorMessage
                            }
                        )}
                        value={value?.getDate() || date.date}
                    >
                        <option disabled>Ngày</option>
                        {range(1, 32).map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <select
                        onChange={handleChange}
                        name='month'
                        className={classNames(
                            'h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange',
                            {
                                'rounded-sm border border-red-300 text-red-500 outline-none focus:border-red-600 focus:shadow-sm':
                                    errorMessage
                            }
                        )}
                        value={value?.getMonth() || date.month}
                    >
                        <option disabled>Tháng</option>
                        {range(0, 12).map((item) => (
                            <option value={item} key={item}>
                                {item + 1}
                            </option>
                        ))}
                    </select>
                    <select
                        onChange={handleChange}
                        name='year'
                        className={classNames(
                            'h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange',
                            {
                                'rounded-sm border border-red-300 text-red-500 outline-none focus:border-red-600 focus:shadow-sm':
                                    errorMessage
                            }
                        )}
                        value={value?.getFullYear() || date.year}
                    >
                        <option disabled>Năm</option>
                        {range(1990, getYearCurrent + 1).map((item) => (
                            <option value={item} key={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
            </div>
        </div>
    )
}
