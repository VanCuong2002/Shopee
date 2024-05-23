import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import UserSideNav from 'src/pages/User/components/UserSideNav'

export default function UserLayout() {
    return (
        <div className='bg-neutral-100 pt-6 text-sm text-gray-600'>
            <Helmet>
                <title>Shopee Việt Nam | Hot Deals, Best Prices</title>
                <meta name='description' property='og:title' content='Shopee Việt Nam | Hot Deals, Best Prices' />
            </Helmet>
            <div className='container'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
                    <div className='md:col-span-3 lg:col-span-2'>
                        <UserSideNav />
                    </div>
                    <div className='md:col-span-9 lg:col-span-10'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}
