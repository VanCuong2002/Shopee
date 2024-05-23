import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'

import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import { setProfileToLS } from 'src/utils/auth'
import InputFile from 'src/components/InputFile'
import { ErrorResponse } from 'src/types/utils.type'
import InputNumber from 'src/components/InputNumber'
import { AppContext } from 'src/contexts/app.context'
import { userSchema, UserSchema } from 'src/utils/rules'
import DateSelect from 'src/pages/User/components/DateSelect'
import { getAvatarUrl, isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
    date_of_birth?: string
}
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

export default function Profile() {
    const { t } = useTranslation('profile')
    const { setProfile } = useContext(AppContext)
    const [file, setFile] = useState<File>()

    const previewImage = useMemo(() => {
        return file ? URL.createObjectURL(file) : ''
    }, [file])

    const { data: profileData, refetch } = useQuery({
        queryKey: ['profile'],
        queryFn: userApi.getProfile,
        keepPreviousData: true
    })
    const profile = profileData?.data.data
    const updateProfileMutation = useMutation(userApi.updateProfile)
    const uploadAvatarMutaion = useMutation(userApi.uploadAvatar)
    const methods = useForm<FormData>({
        defaultValues: {
            name: '',
            phone: '',
            avatar: '',
            address: '',
            date_of_birth: new Date(1990, 0, 1)
        },
        resolver: yupResolver(profileSchema)
    })

    const {
        watch,
        control,
        setValue,
        register,
        setError,
        handleSubmit,
        formState: { errors }
    } = methods

    const avatar = watch('avatar')

    useEffect(() => {
        if (profile) {
            setValue('avatar', profile.avatar)
            setValue('name', profile.name || '')
            setValue('phone', profile.phone || '')
            setValue('address', profile.address || '')
            setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
        }
    }, [profile, setValue])

    const onSubmit = handleSubmit(async (data) => {
        try {
            let avatarName = avatar
            if (file) {
                const form = new FormData()
                form.append('image', file)
                const uploadRes = await uploadAvatarMutaion.mutateAsync(form)
                avatarName = uploadRes.data.data
                setValue('avatar', avatarName)
            }
            const res = await updateProfileMutation.mutateAsync({
                ...data,
                date_of_birth: data.date_of_birth?.toISOString(),
                avatar: avatarName
            })
            setProfile(res.data.data)
            setProfileToLS(res.data.data)
            refetch()
            toast.success(res.data.message)
        } catch (error) {
            if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
                const formError = error.response?.data.data
                if (formError) {
                    Object.keys(formError).forEach((key) => {
                        setError(key as keyof FormDataError, {
                            message: formError[key as keyof FormDataError],
                            type: 'Server'
                        })
                    })
                }
            }
        }
    })

    const handleChangeFile = (file?: File) => {
        setFile(file)
    }

    return (
        <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
            <div className='border-b border-b-gray-200 py-6'>
                <h1 className='text-lg font-medium capitalize text-gray-900'>{t('account.title')}</h1>
                <div className='mt-1 text-sm text-gray-700'>{t('account.description')}</div>
            </div>
            <FormProvider {...methods}>
                <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
                    <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
                        <div className='flex flex-col flex-wrap sm:flex-row'>
                            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
                            <div className='sm:w-[80%] sm:pl-5'>
                                <div className='pt-3 text-gray-700'>{profile?.email}</div>
                            </div>
                        </div>
                        {/* <Info /> */}
                        <Fragment>
                            <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
                                <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
                                    {t('account.name')}
                                </div>
                                <div className='sm:w-[80%] sm:pl-5'>
                                    <Input
                                        type='text'
                                        name='name'
                                        register={register}
                                        errorMessage={errors.name?.message}
                                    />
                                </div>
                            </div>
                            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                                <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
                                    {t('account.phoneNumber')}
                                </div>
                                <div className='sm:w-[80%] sm:pl-5'>
                                    <Controller
                                        control={control}
                                        name='phone'
                                        render={({ field }) => (
                                            <InputNumber
                                                errorMessage={errors.phone?.message}
                                                {...field}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </Fragment>
                        <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>
                                {t('account.address')}
                            </div>
                            <div className='sm:w-[80%] sm:pl-5'>
                                <Input
                                    type='text'
                                    name='address'
                                    register={register}
                                    errorMessage={errors.address?.message}
                                />
                            </div>
                        </div>
                        <Controller
                            control={control}
                            name='date_of_birth'
                            render={({ field }) => (
                                <DateSelect
                                    t={t}
                                    value={field.value}
                                    onChange={field.onChange}
                                    errorMessage={errors.date_of_birth?.message}
                                />
                            )}
                        />
                        <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
                            <div className='sm:w-[80%] sm:pl-5'>
                                <Button
                                    className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                                    type='submit'
                                >
                                    {t('account.save')}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
                        <div className='flex flex-col items-center'>
                            <div className='my-5 h-24 w-24'>
                                <img
                                    alt='avatar'
                                    src={previewImage || getAvatarUrl(avatar)}
                                    className='h-full w-full rounded-full object-cover'
                                />
                            </div>
                            <InputFile t={t} onChange={handleChangeFile} />
                            <div className='mt-3 text-gray-400'>
                                <div>{t('account.fileSize')}</div>
                                <div>{t('account.fileExtension')}</div>
                            </div>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}
