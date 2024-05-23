import * as yup from 'yup'
import { AnyObject } from 'yup/lib/types'

const vietnamPhoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/

function testPriceMinMax(this: yup.TestContext<AnyObject>) {
    const { price_max, price_min } = this.parent as {
        price_min: string
        price_max: string
    }
    if (price_min !== '' && price_max !== '') {
        return Number(price_max) >= Number(price_min)
    }
    return price_min !== '' || price_max !== ''
}

const checkNewPasswordNotSameAsOld = (oldPasswordRef: string) => {
    return yup
        .string()
        .required('Mật khẩu mới là bắt buộc')
        .min(6, 'Độ dài từ 6 - 160 ký tự')
        .max(160, 'Độ dài từ 6 - 160 ký tự')
        .test('not-same-as-old-password', function (value) {
            const { path, createError } = this
            const oldPassword = this.resolve(yup.ref(oldPasswordRef))
            return (
                oldPassword !== value ||
                createError({ path, message: 'Mật khẩu mới không được trùng mật khẩu hiện tại' })
            )
        })
}

const handleConfirmPasswordYup = (refString: string) => {
    return yup
        .string()
        .required('Nhập lại password là bắt buộc')
        .min(6, 'Độ dài từ 6 - 160 ký tự')
        .max(160, 'Độ dài từ 6 - 160 ký tự')
        .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}

export const schema = yup.object().shape({
    email: yup.string().required('Email là bắt buộc').email('Email không đúng định dạng'),
    password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirm_password: yup
        .string()
        .required('Vui lòng xác thực mật khẩu')
        .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
    price_min: yup.string().test({
        name: 'price-not-allowed',
        message: 'Giá không phù hợp',
        test: testPriceMinMax
    }),
    price_max: yup.string().test({
        name: 'price-not-allowed',
        message: 'Giá không phù hợp',
        test: testPriceMinMax
    }),
    name: yup.string().trim().required('Hãy nhập tên sản phẩm cần tìm!')
})

export const userSchema = yup.object({
    name: yup.string().required('Vui lòng nhập tên').max(160, 'Độ dài tối đa là 160 ký tự'),
    phone: yup
        .string()
        .required('Vui lòng nhập số điện thoại')
        .matches(vietnamPhoneRegex, 'Số điện thoại không hợp lệ'),
    address: yup.string().required('Vui lòng nhập địa chỉ').max(160, 'Độ dài tối đa là 160 ký tự'),
    avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
    date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
    password: schema.fields['password'],
    new_password: checkNewPasswordNotSameAsOld('password'),
    confirm_password: handleConfirmPasswordYup('new_password')
})

export type UserSchema = yup.InferType<typeof userSchema>
export type Schema = yup.InferType<typeof schema>
