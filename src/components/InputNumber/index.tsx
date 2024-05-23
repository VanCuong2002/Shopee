import classNames from 'classnames'
import { InputHTMLAttributes, forwardRef, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
    errorMessage?: string
    classNameInput?: string
    classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
    {
        onChange,
        className,
        value = '',
        errorMessage,
        classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
        classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
        ...rest
    },
    ref
) {
    const [localValue, setLocalValue] = useState<string>(value as string)

    const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        if (/^\d+$/.test(value) || value === '') {
            onChange && onChange(event)
            setLocalValue(value)
        }
    }

    return (
        <div className={'relative ' + className}>
            <input
                ref={ref}
                autoComplete='on'
                className={classNames(classNameInput, {
                    'rounded-sm border border-red-300 text-red-500 outline-none focus:border-red-600 focus:shadow-sm':
                        errorMessage
                })}
                value={value === undefined ? localValue : value}
                onChange={handleChangeValue}
                {...rest}
            />
            {errorMessage && <div className={classNameError}>{errorMessage}</div>}
        </div>
    )
})

export default InputNumber
