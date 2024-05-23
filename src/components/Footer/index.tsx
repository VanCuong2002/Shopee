import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Footer() {
    const { t } = useTranslation('footer')
    return (
        <footer className='bg-red-50 py-12 text-gray-400'>
            <div className='container'>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                    <div className='lg:col-span-1'>
                        <div>
                            © {new Date().getFullYear()} {t('rights reserved')}
                        </div>
                    </div>
                    <div className='lg:col-span-2'>{t('country region')}</div>
                </div>
                <div className='mt-8 text-center text-sm font-thin'>{t('policy')}</div>
                <div className='mt-10 text-center text-sm'>
                    <div className='mb-2 flex items-center justify-center gap-8'>
                        <Link
                            to='https://help.shopee.vn/portal/4/'
                            target='_blank'
                            style={{
                                height: '48px',
                                width: '120px',
                                backgroundPosition: '14.391143911439114% 99.41176470588235%',
                                backgroundSize: '551.6666666666666% 477.77777777777777%',
                                backgroundImage:
                                    'url(https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/9765d68a8945750d.png)'
                            }}
                        ></Link>
                        <Link
                            to='https://help.shopee.vn/portal/4/'
                            target='_blank'
                            style={{
                                height: '48px',
                                width: '120px',
                                backgroundPosition: '14.391143911439114% 99.41176470588235%',
                                backgroundSize: '551.6666666666666% 477.77777777777777%',
                                backgroundImage:
                                    'url(https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/9765d68a8945750d.png)'
                            }}
                        ></Link>
                        <Link
                            to='https://help.shopee.vn/portal/4/'
                            target='_blank'
                            style={{
                                height: '48px',
                                width: '48px',
                                backgroundPosition: '1.6286644951140066% 92.21556886227545%',
                                backgroundSize: '1379.1666666666667% 447.9166666666667%',
                                backgroundImage:
                                    'url(https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/9765d68a8945750d.png)'
                            }}
                        ></Link>
                    </div>
                    <div>{t('company')}</div>
                    <div className='mt-6'>{t('address')}</div>
                    <div className='mt-2'>{t('responsible')}</div>
                    <div className='mt-2'>{t('business code')}</div>
                    <div className='mt-2'>{t('copyright')}</div>
                </div>
            </div>
        </footer>
    )
}
