import omit from 'lodash/omit'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'

import path from 'src/constants/path'
import authApi from 'src/apis/auth.api'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import { Schema, schema } from 'src/utils/rules'
import { ErrorResponse } from 'src/types/utils.type'
import { AppContext } from 'src/contexts/app.context'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

const Register = () => {
    const { t } = useTranslation('authentication')
    const navigate = useNavigate()
    const { setIsAuthenticated, setProfile } = useContext(AppContext)
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(registerSchema)
    })

    const registerAccountMutation = useMutation({
        mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
    })

    const onSubmit = handleSubmit((data) => {
        const body = omit(data, ['confirm_password'])
        registerAccountMutation.mutate(body, {
            onSuccess: (data) => {
                navigate(path.home)
                setIsAuthenticated(true)
                setProfile(data.data.data.user)
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
                    const formError = error.response?.data.data
                    if (formError) {
                        Object.keys(formError).forEach((key) => {
                            setError(key as keyof Omit<FormData, 'confirm_password'>, {
                                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                                type: 'Server'
                            })
                        })
                    }
                }
            }
        })
    })

    return (
        <div className='bg-orange'>
            <Helmet>
                <title>{t('domainSignUp')}</title>
                <meta name='description' content={t('domainSignUp')} />
            </Helmet>
            <div className='container p-12'>
                <div className='grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12'>
                    <div className='md:col-span-5 md:col-start-7 lg:col-span-4 lg:col-start-8'>
                        <form noValidate onSubmit={onSubmit} className='rounded bg-white p-7 text-sm shadow-sm'>
                            <div className='mb-6 text-xl'>{t('titleSignUp')}</div>
                            <Input
                                type='email'
                                name='email'
                                placeholder='Email'
                                register={register}
                                classDistance='mb-8'
                                classDistanceError='mb-3'
                                errorMessage={errors.email?.message}
                            />
                            <Input
                                type='password'
                                name='password'
                                register={register}
                                classDistance='mb-8'
                                placeholder={t('placeholderPass')}
                                classDistanceError='mb-3'
                                errorMessage={errors.password?.message}
                            />
                            <Input
                                type='password'
                                register={register}
                                classDistance='mb-8'
                                name='confirm_password'
                                classDistanceError='mb-3'
                                placeholder={t('placeholderAuth')}
                                errorMessage={errors.confirm_password?.message}
                            />
                            <Button
                                isLoading={registerAccountMutation.isLoading}
                                disabled={registerAccountMutation.isLoading}
                                className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-base uppercase text-white hover:bg-red-600'
                            >
                                {t('titleSignUp')}
                            </Button>
                            <div className='mt-6 flex items-center justify-center text-sm'>
                                <span className='mr-1 text-gray-400'>{t('question')}</span>
                                <Link className='text-orange' to={path.login}>
                                    {t('titleLogin')}
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
