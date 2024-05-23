import { useContext, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AppContext } from 'src/contexts/app.context'
import { LocalStorageEventTarget } from 'src/utils/auth'
import useRouteElements from 'src/router/useRouteElements'

function App() {
    const routeElement = useRouteElements()
    const { reset } = useContext(AppContext)

    useEffect(() => {
        LocalStorageEventTarget.addEventListener('clearLS', reset)
        return () => {
            LocalStorageEventTarget.removeEventListener('clearLS', reset)
        }
    }, [reset])

    return (
        <>
            {routeElement}
            <ToastContainer />
        </>
    )
}

export default App
