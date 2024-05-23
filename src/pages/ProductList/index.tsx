import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'

import productApi from 'src/apis/product.api'
import categoryApi from 'src/apis/category.api'
import Pagination from 'src/components/Pagination'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'
import Product from 'src/pages/ProductList/components/Product'
import AsideFilter from 'src/pages/ProductList/components/AsideFilter'
import SortProductList from 'src/pages/ProductList/components/SortProductList'

export default function ProductList() {
    const queryConfig = useQueryConfig()

    const { data: productsData, isLoading } = useQuery({
        queryKey: ['products', queryConfig],
        queryFn: () => {
            return productApi.getProducts(queryConfig as ProductListConfig)
        },
        keepPreviousData: true,
        staleTime: 3 * 60 * 1000
    })

    const { data: productsMayLike } = useQuery({
        queryKey: ['products'],
        queryFn: () => {
            return productApi.getProducts()
        },
        keepPreviousData: true,
        staleTime: 3 * 60 * 1000
    })

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => {
            return categoryApi.getCategories()
        }
    })

    return (
        <div className='bg-neutral-100 pt-6 xs:pt-2'>
            <Helmet>
                <title>Shopee Việt Nam | Hot Deals, Best Prices</title>
                <meta name='description' property='og:title' content='Shopee Việt Nam | Hot Deals, Best Prices' />
            </Helmet>
            <div className='container xs:p-2'>
                {productsData && productsData?.data.data.products.length > 0 && (
                    <div className='grid grid-cols-12 gap-6'>
                        <div className='xs:hidden sm:hidden md:col-span-3 md:block'>
                            <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
                        </div>
                        <div className='xs:col-span-12 sm:col-span-12 md:col-span-9'>
                            <SortProductList
                                queryConfig={queryConfig}
                                pageSize={productsData.data.data.pagination.page_size}
                            />
                            <div className='mt-6 grid gap-[10px] xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                                {productsData?.data?.data?.products.map((product) => (
                                    <div className='col-span-1' key={product._id}>
                                        <Product product={product} />
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                queryConfig={queryConfig}
                                pageSize={productsData.data.data.pagination.page_size}
                            />
                        </div>
                    </div>
                )}
                {productsData && productsData?.data.data.products.length === 0 && !isLoading && (
                    <div className='grid grid-cols-12 gap-6'>
                        <div className='xs:hidden sm:hidden md:col-span-3 md:block'>
                            <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
                        </div>
                        <div className='flex flex-col items-center justify-center xs:col-span-12 md:col-span-9'>
                            <img
                                alt='not-found'
                                className='h-36 w-36 '
                                src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/search/a60759ad1dabe909c46a.png'
                            />
                            <span className='text-lg'>Không tìm thấy kết quả nào</span>
                            <span className='text-lg text-gray-400'>Hãy thử sử dụng các từ khóa chung chung hơn</span>
                        </div>
                        <div className='col-span-12 xs:col-span-12'>
                            <div className='uppercase text-gray-400'>CÓ THỂ BẠN CŨNG THÍCH</div>
                            <div className='mt-6 grid gap-3 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
                                {productsMayLike?.data?.data?.products.slice(0, 12).map((product) => (
                                    <div className='col-span-1' key={product._id}>
                                        <Product product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
