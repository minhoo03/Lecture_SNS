import { useState } from "react"
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

import GithubButton from "../components/github-btn"

import { Link, useNavigate } from "react-router-dom"
import {
    Input,
    Title,
    Wrapper,
    Form,
    Error,
    Switcher
} from "../components/auth-components"
import { FirebaseError } from "firebase/app"

const Login = () => {
    const navi = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 구조화
        const { 
            target: { name, value }
        } = e

        if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 데이터 유무 확인
        if (email === "" || password === "") return;

        setError("")
        
        try {
            setIsLoading(true)

            // 입력한 정보대로 로그인
            await signInWithEmailAndPassword(
                auth, // 인증 인스턴스
                email, // 사용자 이메일
                password, // 사용자 패스워드
            )

            navi("/")
        } catch (e) {
            // 실패한 경우
            if (e instanceof FirebaseError) {
                setError(e.message)
            }
        } finally {
            // 성공이든 실패든 무조건 거침
            setIsLoading(false)
        }
    }

    return (
        <Wrapper>
            <Title>Log in</Title>
            <Form onSubmit={onSubmit}>
                <Input placeholder="id" type="text" name="email" onChange={handleChange} value={email} />
                <Input placeholder="pwd" type="password" name="password" onChange={handleChange} value={password} />

                <Input type="submit" value={isLoading ? "Loading..." : "Create Account"} />
            </Form>
            {
                error != "" ? <Error>{error}</Error> : null
            }
            <Switcher>
                Join - {""}
                <Link to="/create-account">Create One</Link>
            </Switcher>

            <GithubButton />
        </Wrapper>
    )
}

export default Login
