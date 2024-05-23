import { useContext } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'

import path from 'src/constants/path'
import { getAvatarUrl } from 'src/utils/utils'
import { AppContext } from 'src/contexts/app.context'

export default function UserSideNav() {
    const { t } = useTranslation('profile')
    const { profile } = useContext(AppContext)

    return (
        <>
            <div className='flex w-full items-center overflow-hidden border-b border-b-gray-200 py-4'>
                <Link
                    to={path.profile}
                    className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10'
                >
                    <img src={getAvatarUrl(profile?.avatar)} alt='avatar_user' className='h-full w-full object-cover' />
                </Link>
                <div className='pl-4'>
                    <div className='mb-1 truncate font-semibold text-gray-600'>{profile?.email}</div>
                    <Link to={path.profile} className='flex items-center capitalize text-gray-500'>
                        <svg
                            width={12}
                            height={12}
                            viewBox='0 0 12 12'
                            xmlns='http://www.w3.org/2000/svg'
                            style={{ marginRight: 4 }}
                        >
                            <path
                                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                                fill='#9B9B9B'
                                fillRule='evenodd'
                            />
                        </svg>
                        {t('aside.edit')}
                    </Link>
                </div>
            </div>
            <div className='mt-7'>
                <NavLink
                    to={path.profile}
                    className={({ isActive }) =>
                        classNames('flex items-center capitalize  transition-colors', {
                            'text-orange': isActive,
                            'text-gray-600': !isActive
                        })
                    }
                >
                    <div className='mr-3 h-[20px] w-[20px]'>
                        <img
                            src='https://cdn-icons-png.flaticon.com/256/747/747376.png'
                            alt=''
                            className='h-full w-full'
                        />
                    </div>
                    {t('aside.myAccount')}
                </NavLink>
                <NavLink
                    to={path.changePassword}
                    className={({ isActive }) =>
                        classNames('mt-4 flex items-center capitalize transition-colors', {
                            'text-orange': isActive,
                            'text-gray-600': !isActive
                        })
                    }
                >
                    <div className='mr-3 h-[20px] w-[20px]'>
                        <img
                            src='https://static-00.iconduck.com/assets.00/password-icon-2048x2048-db92yrsb.png'
                            alt=''
                            className='h-full w-full'
                        />
                    </div>
                    {t('aside.changePass')}
                </NavLink>
                <NavLink
                    to={path.historyPurchase}
                    className={({ isActive }) =>
                        classNames('mt-4 flex items-center  capitalize transition-colors', {
                            'text-orange': isActive,
                            'text-gray-600': !isActive
                        })
                    }
                >
                    <div className='mr-3 h-[20px] w-[20px]'>
                        <img
                            src='https://banner2.cleanpng.com/20181218/fbj/kisspng-computer-icons-scalable-vector-graphics-portable-n-5c18b6ce2017d1.0359504915451235341315.jpg'
                            alt=''
                            className='h-full w-full'
                        />
                    </div>
                    {t('aside.purchase')}
                </NavLink>
            </div>
        </>
    )
}
