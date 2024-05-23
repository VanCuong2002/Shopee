import React from 'react'
import Footer from 'src/components/Footer'
import RegisterHeader from 'src/components/Header/AuthHeader'

interface Props {
    children?: React.ReactNode
}

const AuthenticationLayout = ({ children }: Props) => {
    return (
        <div>
            <RegisterHeader />
            {children}
            <Footer />
        </div>
    )
}

export default AuthenticationLayout
