import omit from 'lodash/omit'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createSearchParams, useNavigate } from 'react-router-dom'

import path from 'src/constants/path'
import { Schema, schema } from 'src/utils/rules'
import useQueryConfig from 'src/hooks/useQueryConfig'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])

export const useSearchProducts = () => {
    const navigate = useNavigate()
    const queryConfig = useQueryConfig()

    const { register, handleSubmit } = useForm<FormData>({
        defaultValues: {
            name: ''
        },
        resolver: yupResolver(nameSchema)
    })

    const onSubmitSearch = handleSubmit((data) => {
        const { name } = data
        navigate({
            pathname: path.home,
            search: createSearchParams(
                omit(
                    {
                        ...queryConfig,
                        name
                    },
                    ['category', 'order', 'sort_by', 'price_max', 'price_min']
                )
            ).toString()
        })
    })

    return { onSubmitSearch, register }
}
