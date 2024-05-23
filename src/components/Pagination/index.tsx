import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'

import path from 'src/constants/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
    queryConfig: QueryConfig
    pageSize: number
}

/**
Với range = 2 áp dụng cho khoảng cách đầu, cuối và xung quanh current_page

[1] 2 3 ... 19 20
1 [2] 3 4 ... 19 20 
1 2 [3] 4 5 ... 19 20
1 2 3 [4] 5 6 ... 19 20
1 2 3 4 [5] 6 7 ... 19 20

1 2 ... 4 5 [6] 8 9 ... 19 20

1 2 ...13 14 [15] 16 17 ... 19 20


1 2 ... 14 15 [16] 17 18 19 20
1 2 ... 15 16 [17] 18 19 20
1 2 ... 16 17 [18] 19 20
1 2 ... 17 18 [19] 20
1 2 ... 18 19 [20]
 */

const RANGE = 1
export default function Pagination({ queryConfig, pageSize }: Props) {
    const pageCurrent = Number(queryConfig.page)

    const renderPagination = () => {
        let dotAfter = false
        let dotBefore = false
        const renderDotBefore = (index: number) => {
            if (!dotBefore) {
                dotBefore = true
                return (
                    <span key={index} className='mx-2 rounded border bg-white px-3 py-2 shadow-sm'>
                        ...
                    </span>
                )
            }
            return null
        }
        const renderDotAfter = (index: number) => {
            if (!dotAfter) {
                dotAfter = true
                return (
                    <span key={index} className='mx-2 rounded border bg-white px-3 py-2 shadow-sm'>
                        ...
                    </span>
                )
            }
            return null
        }
        return Array(pageSize)
            .fill(0)
            .map((_, index) => {
                const pageNumber = index + 1

                // Điều kiện để return về ...
                if (
                    pageCurrent <= RANGE * 2 + 1 &&
                    pageNumber > pageCurrent + RANGE &&
                    pageNumber < pageSize - RANGE + 1
                ) {
                    return renderDotAfter(index)
                } else if (pageCurrent > RANGE * 2 + 1 && pageCurrent < pageSize - RANGE * 2) {
                    if (pageNumber < pageCurrent - RANGE && pageNumber > RANGE) {
                        return renderDotBefore(index)
                    } else if (pageNumber > pageCurrent + RANGE && pageNumber < pageSize - RANGE + 1) {
                        return renderDotAfter(index)
                    }
                } else if (
                    pageCurrent >= pageSize - RANGE * 2 &&
                    pageNumber > RANGE &&
                    pageNumber < pageCurrent - RANGE
                ) {
                    return renderDotBefore(index)
                }

                return (
                    <Link
                        to={{
                            pathname: path.home,
                            search: createSearchParams({
                                ...queryConfig,
                                page: pageNumber.toString()
                            }).toString()
                        }}
                        key={index}
                        className={classNames('xs mx-2 cursor-pointer rounded px-5 py-1 shadow-sm', {
                            'bg-orange text-white': pageNumber === pageCurrent,
                            'bg-white': pageNumber !== pageCurrent
                        })}
                    >
                        {pageNumber}
                    </Link>
                )
            })
    }
    return (
        <div className='mt-6 flex flex-wrap items-center justify-center xs:flex-col'>
            <div className='xs:flex xs:w-full xs:justify-center'>
                {pageCurrent === 1 ? (
                    <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2 shadow-sm'>Prev</span>
                ) : (
                    <Link
                        to={{
                            pathname: path.home,
                            search: createSearchParams({
                                ...queryConfig,
                                page: (pageCurrent - 1).toString()
                            }).toString()
                        }}
                        className='mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm'
                    >
                        Prev
                    </Link>
                )}
            </div>

            <div className='flex justify-center xs:my-2'>{renderPagination()}</div>
            <div className='xs:flex xs:w-full xs:justify-center'>
                {pageCurrent === pageSize ? (
                    <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm'>
                        Next
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
                        className='mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm'
                    >
                        Next
                    </Link>
                )}
            </div>
        </div>
    )
}
