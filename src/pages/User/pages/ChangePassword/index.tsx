import omit from 'lodash/omit'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'

import userApi from 'src/apis/user.api'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import { ErrorResponse } from 'src/types/utils.type'
import { userSchema, UserSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

export default function ChangePassword() {
    const { t } = useTranslation('profile')
    const {
        register,
        formState: { errors },
        handleSubmit,
        setError,
        reset
    } = useForm<FormData>({
        defaultValues: {
            password: '',
            confirm_password: '',
            new_password: ''
        },
        resolver: yupResolver(passwordSchema)
    })
    const updateProfileMutation = useMutation(userApi.updateProfile)

    const onSubmit = handleSubmit(async (data) => {
        try {
            const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
            toast.success(res.data.message)
            reset()
        } catch (error) {
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

    return (
        <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
            <div className='border-b border-b-gray-200 py-6'>
                <h1 className='text-lg font-medium capitalize text-gray-900'>{t('change.title')}</h1>
                <div className='mt-1 text-sm text-gray-700'>{t('change.description')}</div>
            </div>
            <form className='mr-auto mt-8 max-w-2xl' onSubmit={onSubmit}>
                <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
                    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
                            {t('change.currentPass')}
                        </div>
                        <div className='sm:w-[80%] sm:pl-5'>
                            <Input
                                register={register}
                                name='password'
                                type='password'
                                errorMessage={errors.password?.message}
                            />
                        </div>
                    </div>
                    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('change.newPass')}</div>
                        <div className='sm:w-[80%] sm:pl-5'>
                            <Input
                                type='password'
                                register={register}
                                name='new_password'
                                errorMessage={errors.new_password?.message}
                            />
                        </div>
                    </div>
                    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
                            {t('change.confirmtPass')}
                        </div>
                        <div className='sm:w-[80%] sm:pl-5'>
                            <Input
                                type='password'
                                register={register}
                                name='confirm_password'
                                errorMessage={errors.confirm_password?.message}
                            />
                        </div>
                    </div>
                    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
                        <div className='sm:w-[80%] sm:pl-5'>
                            <Button
                                className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                                type='submit'
                            >
                                {t('change.save')}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
