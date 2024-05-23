import { Suspense, lazy, useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'

import path from 'src/constants/path'
import MainLayout from 'src/layouts/MainLayout'
import CartLayout from 'src/layouts/CartLayout'
import Info from 'src/pages/User/pages/Profile'
import { AppContext } from 'src/contexts/app.context'
import UserLayout from 'src/layouts/UserLayout/idex'
import ChangePassword from 'src/pages/User/pages/ChangePassword'
import HistoryPurchase from 'src/pages/User/pages/HistoryPurchase'
import AuthenticationLayout from 'src/layouts/AuthenticationLayout'

const Cart = lazy(() => import('src/pages/Cart'))
const Login = lazy(() => import('src/pages/Login'))
const Register = lazy(() => import('src/pages/Register'))
const NotFound = lazy(() => import('src/pages/NotFound'))
const ProductList = lazy(() => import('src/pages/ProductList'))
const ProductDetail = lazy(() => import('src/pages/ProductDetail'))

function ProtectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
    const routeElement = useRoutes([
        {
            path: '',
            element: <RejectedRoute />,
            children: [
                {
                    path: path.login,
                    element: (
                        <Suspense>
                            <AuthenticationLayout>
                                <Login />
                            </AuthenticationLayout>
                        </Suspense>
                    )
                },
                {
                    path: path.register,
                    element: (
                        <AuthenticationLayout>
                            <Suspense>
                                <Register />
                            </Suspense>
                        </AuthenticationLayout>
                    )
                }
            ]
        },
        {
            path: '',
            element: <ProtectedRoute />,
            children: [
                {
                    path: path.cart,
                    element: (
                        <CartLayout>
                            <Suspense>
                                <Cart />
                            </Suspense>
                        </CartLayout>
                    )
                },
                {
                    path: path.user,
                    element: (
                        <MainLayout>
                            <UserLayout />
                        </MainLayout>
                    ),
                    children: [
                        {
                            path: path.profile,
                            element: (
                                <Suspense>
                                    <Info />
                                </Suspense>
                            )
                        },
                        {
                            path: path.changePassword,
                            element: (
                                <Suspense>
                                    <ChangePassword />
                                </Suspense>
                            )
                        },
                        {
                            path: path.historyPurchase,
                            element: (
                                <Suspense>
                                    <HistoryPurchase />
                                </Suspense>
                            )
                        }
                    ]
                }
            ]
        },
        {
            path: path.productDetail,
            element: (
                <MainLayout>
                    <Suspense>
                        <ProductDetail />
                    </Suspense>
                </MainLayout>
            )
        },
        {
            path: '',
            index: true,
            element: (
                <MainLayout>
                    <Suspense>
                        <ProductList />
                    </Suspense>
                </MainLayout>
            )
        },
        {
            path: '*',
            element: (
                <MainLayout>
                    <Suspense>
                        <NotFound />
                    </Suspense>
                </MainLayout>
            )
        }
    ])
    return routeElement
}
