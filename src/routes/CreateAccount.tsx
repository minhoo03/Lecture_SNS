import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase'

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

const CreateAccount = () => {
    const navi = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 구조화
        const { 
            target: { name, value }
        } = e

        if (name === "name") {
            setName(value)
        } else if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 데이터 유무 확인
        if (name === "" || email === "" || password === "") return;

        setError("")
        
        try {
            setIsLoading(true)

            // *사용자 계정 생성 -> 성공하면 자격 증명 획득 후 즉시 로그인
            // 파이어베이스쪽에서 데이터 확인 및 계정 생성하는 시간 필요
            // 그렇기에 await 을 이용하여 비동기 막기
            const credentials = await createUserWithEmailAndPassword(
                auth, // 인증 인스턴스
                email, // 사용자 이메일
                password, // 사용자 패스워드
            )

            // *프로필 업데이트 (닉네임 변경하는 데 사용할 의도로)
            // 업데이트할 사용자는 credentials.user
            await updateProfile(credentials.user, {
                displayName: name   
            })

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
            <Title>Join</Title>
            <Form onSubmit={onSubmit}>
                <Input placeholder="name" type="text" name="name" onChange={handleChange} value={name} />
                <Input placeholder="id" type="text" name="email" onChange={handleChange} value={email} />
                <Input placeholder="pwd" type="password" name="password" onChange={handleChange} value={password} />

                <Input type="submit" value={isLoading ? "Loading..." : "Create Account"} />
            </Form>
            {
                error != "" ? <Error>{error}</Error> : null
            }
            <Switcher>
                Login - {""}
                <Link to="/login">link</Link>
            </Switcher>
        </Wrapper>
    )
}

export default CreateAccount
