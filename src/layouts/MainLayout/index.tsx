import React from 'react'
import Footer from 'src/components/Footer'
import { Seperate } from 'src/components/Seperate'
import MainHeader from 'src/components/Header/MainHeader'

interface Props {
    children?: React.ReactNode
}

const MainLayout = ({ children }: Props) => {
    return (
        <div>
            <MainHeader />
            {children}
            <Seperate />
            <Footer />
        </div>
    )
}

export default MainLayout
