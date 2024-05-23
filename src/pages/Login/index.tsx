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

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

const Login = () => {
    const { t } = useTranslation('authentication')
    const navigate = useNavigate()
    const { setIsAuthenticated, setProfile } = useContext(AppContext)
    const {
        register,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(loginSchema)
    })

    const loginMutation = useMutation({
        mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.login(body)
    })
    const onSubmit = handleSubmit((data) => {
        loginMutation.mutate(data, {
            onSuccess: (data) => {
                setIsAuthenticated(true)
                setProfile(data.data.data.user)
                navigate(path.home)
            },
            onError: (error) => {
                if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
                    const formError = error.response?.data.data
                    if (formError) {
                        Object.keys(formError).forEach((key) => {
                            setError(key as keyof FormData, {
                                message: formError[key as keyof FormData],
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
                <title>{t('domainLogin')}</title>
                <meta name='description' content={t('domainLogin')} />
            </Helmet>
            <div className='container p-12'>
                <div className='grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12'>
                    <div className='md:col-span-5 md:col-start-7 lg:col-span-4 lg:col-start-8'>
                        <form onSubmit={onSubmit} noValidate className='rounded bg-white p-7 text-sm shadow-sm'>
                            <div className='mb-6 text-xl capitalize'>{t('titleLogin')}</div>
                            <Input
                                name='email'
                                type='email'
                                placeholder='Email'
                                register={register}
                                classDistance='mb-8'
                                classDistanceError='mb-3'
                                errorMessage={errors.email?.message}
                            />
                            <Input
                                name='password'
                                type='password'
                                register={register}
                                classDistance='mb-8'
                                placeholder={t('placeholderPass')}
                                classDistanceError='mb-3'
                                errorMessage={errors.password?.message}
                            />
                            <Button
                                isLoading={loginMutation.isLoading}
                                disabled={loginMutation.isLoading}
                                className='flex w-full items-center justify-center bg-red-500 px-2 py-4 text-base uppercase text-white hover:bg-red-600'
                            >
                                {t('titleLogin')}
                            </Button>
                            <div className='mt-6 flex items-center justify-center text-sm'>
                                <span className='mr-1 text-gray-400'>{t('newTo')}</span>
                                <Link className='text-orange' to={path.register}>
                                    {t('titleSignUp')}
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
