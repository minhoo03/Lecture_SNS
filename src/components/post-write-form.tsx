import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { styled } from 'styled-components';
import { auth, db } from '../firebase'

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const TextArea = styled.textarea`
    border: 1px solid #e1e1e1;
    padding: 12px;
    border-radius: 8px;
    font-size: 16px;
    width: 100%;
    color: #000;

    &::placeholder: {
        font-size: 16px;
    }
`

const SubmitBtn = styled.input`
    background-color: #015bd6;
    color: #fff;
    border: none;
    padding: 10px 0;
    font-size: 16px;
    cursor: pointer;
    border-radius: 50px;
`

const PostWriteForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [feed, setFeed] = useState<string>("");
    
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeed(e.target.value)
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 새로고침 방지

        // 로그인 여부
        const user = auth.currentUser;

        // 로그인이 안되었거나, 빈 값으로 서브밋 한 경우 (submit 취소)
        if(!user || feed === "") return;

        try {
            setIsLoading(true)
            await addDoc(collection(db, "feeds"), { // db의 feeds 콜렉션에 document 추가, { 추가할 데이터 }
                feed,
                createdAt: Date.now(),
                userName: user.displayName || "human",
                userId: user.uid
            })
        } catch (e) {
            console.log(e)
        } finally {
            // 성공/실패 상관 없이 거쳐감
            setIsLoading(false)
        }
    }

    return (
        <Form onSubmit={onSubmit}>
            <TextArea onChange={onChange} placeholder='Write...' maxLength={180} value={feed} />
            <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Feed"} />
        </Form>
    )
}

export default PostWriteForm