import {useState, useEffect} from 'react'

import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from './components/layout'
import LoadingScreen from './components/LoadingScreen'

import Home from './routes/Home'
import Profile from './routes/Profile'
import Login from './routes/Login'
import CreateAccount from './routes/CreateAccount'
import NotFound from './routes/NotFound'

import { createGlobalStyle, styled } from "styled-components"
import reset from "styled-reset"
import { auth } from './firebase'
import ProtectedRoute from './components/protected-route'

const router = createBrowserRouter([
  {
    path: "/",
    element: 
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
    ,
    children: [
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "",
        element: <Home />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/create-account",
    element: <CreateAccount />
  },
  {
    path: "/*",
    element: <NotFound />
  }
])

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
`

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
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
    <Wrapper>
      <GlobalStyles />
      {
        isLoading ? <LoadingScreen /> : <RouterProvider router={router} />
      }
    </Wrapper>
  )
}

export default App
