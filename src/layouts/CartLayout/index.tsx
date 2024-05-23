import React from 'react'
import { Seperate } from 'src/components/Seperate'
import CartHeader from 'src/components/Header/CartHeader'
import Footer from 'src/components/Footer'

interface Props {
    children?: React.ReactNode
}

const CartLayout = ({ children }: Props) => {
    return (
        <div>
            <CartHeader />
            {children}
            <Seperate />
            <Footer />
        </div>
    )
}

export default CartLayout
