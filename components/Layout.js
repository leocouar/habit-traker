import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

import { AuthContextProvider } from '@/context/AuthContext'

function Layout({ children }) {
    

    return (
        < >
            <AuthContextProvider>
                <Nav />
                {children}
                {/* <Footer /> */}
            </AuthContextProvider>
        </>
    )
}

export default Layout