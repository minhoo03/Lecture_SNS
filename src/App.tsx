import {useState, useEffect} from 'react'

import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from './components/layout'
import Home from './components/Home'
import Profile from './components/Profile'
import LoadingScreen from './components/LoadingScreen'

import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"
import { auth } from './firebase'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "home",
        element: <Home />
      }
    ]
  }
])

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
`

function App() {

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const init = async () => {
    // 나중에 파이어베이스가 준비 되었는지 안 되었는지 확인하는 로직
    await auth.authStateReady();
    setIsLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <GlobalStyles />
      {
        isLoading ? <LoadingScreen /> : <RouterProvider router={router} />
      }
    </>
  )
}

export default App
