import { useContext } from 'react'
import trucate from 'lodash/truncate'
import { locales } from 'src/i18n/i18n'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import path from 'src/constants/path'
import authApi from 'src/apis/auth.api'
import { images } from 'src/assets/images'
import Popover from 'src/components/Popover'
import { getAvatarUrl } from 'src/utils/utils'
import { AppContext } from 'src/contexts/app.context'
import { purchasesStatus } from 'src/constants/purchase'

const NavHeader = () => {
    const { i18n, t } = useTranslation('home')
    const currentLanguage = locales[i18n.language as keyof typeof locales]
    const isActiveLanguage = (lng: string) => {
        return i18n.language === lng
    }

    const queryClient = useQueryClient()
    const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext)

    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            setProfile(null)
            setIsAuthenticated(false)
            queryClient.removeQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
        }
    })

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
    }

    return (
        <div className='flex select-none items-center justify-end gap-5 py-1 text-sm xs:hidden'>
            <div className='flex cursor-pointer items-center gap-1 capitalize hover:text-white/70'>
                <img src={images.bell} alt='help' />

                <span>{t('header.notifications')}</span>
            </div>
            <div className='flex cursor-pointer items-center gap-1 capitalize hover:text-white/70'>
                <img src={images.help} alt='help' />
                <span>{t('header.help')}</span>
            </div>
            <Popover
                renderPopover={
                    <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
                        <div className='flex w-52 flex-col'>
                            <div
                                onClick={() => changeLanguage('vi')}
                                aria-hidden='true'
                                className='flex items-center justify-between px-2 py-2 text-left hover:text-orange'
                            >
                                <div>Tiếng Việt</div>
                                {isActiveLanguage('vi') && (
                                    <img src={images.isActiveChevronDown} alt='active chevron-down' />
                                )}
                            </div>
                            <div
                                onClick={() => changeLanguage('en')}
                                aria-hidden='true'
                                className='mt-2 flex items-center justify-between px-2 py-2 text-left hover:text-orange'
                            >
                                <div>English</div>
                                {isActiveLanguage('en') && (
                                    <img src={images.isActiveChevronDown} alt='active chevron-down' />
                                )}
                            </div>
                        </div>
                    </div>
                }
            >
                <img src={images.globe} alt='globe' />
                <span>{currentLanguage}</span>
                <img src={images.chevronDown} alt='chevron-down' />
            </Popover>

            {isAuthenticated && (
                <Popover
                    renderPopover={
                        <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
                            <Link
                                to={path.profile}
                                className='block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500'
                            >
                                Tài khoản của tôi
                            </Link>
                            <Link
                                to={path.historyPurchase}
                                className='block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500'
                            >
                                Đơn mua
                            </Link>
                            <button
                                onClick={() => logoutMutation.mutate()}
                                className='block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500'
                            >
                                Đăng xuất
                            </button>
                        </div>
                    }
                >
                    <div className='h-5 w-5 flex-shrink-0'>
                        <img
                            src={getAvatarUrl(profile?.avatar)}
                            alt='avatar'
                            className='h-full w-full rounded-full object-cover'
                        />
                    </div>
                    <div>
                        {trucate(profile?.email, {
                            length: 20
                        })}
                    </div>
                </Popover>
            )}
            {!isAuthenticated && (
                <div className='flex items-center'>
                    <Link to='register' className='mx-3 capitalize hover:text-white/70'>
                        {t('header.signUp')}
                    </Link>
                    <div className='h-4 border-r-[1px] border-r-white/40' />
                    <Link to='login' className='mx-3 capitalize hover:text-white/70'>
                        {t('header.login')}
                    </Link>
                </div>
            )}
        </div>
    )
}

export default NavHeader
