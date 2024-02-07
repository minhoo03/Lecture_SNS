import styled from "styled-components"
import { auth, db, storage } from "../firebase"
import { deleteDoc, doc, updateDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import React, { useState } from "react"

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border-bottom: 1px solid #e2e2e2;
`

const Column = styled.div``

const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 16px;
`

const UserName = styled.span`
    font-weight: 500;
    font-size: 12px;
`
const FeedText = styled.p`
    margin: 8px 0;
    font-size: 16px;
`

const DeleteButton = styled.button`
    background-color: red;
    color: white;
    font-size: 12px;
    padding: 4px 8px;
    text-transform: uppercase;
    border-radius: 4px;
    cursor: pointer;
    border: none;
`

const UpdateButton = styled.button`
    background-color: #015bd6;
    color: white;
    font-size: 12px;
    padding: 4px 8px;
    text-transform: uppercase;
    border-radius: 4px;
    cursor: pointer;
    border: none;
`

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



interface IFeed {
    id: string;
    userId: string;
    feed: string;
    userName: string;
    photo?: string;
}

export default function Feed({ id, userId, feed, userName, photo }: IFeed) {

    // 현재 로그인 된 정보 가져오기
    const user = auth.currentUser;

    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [updateText, setUpdateText] = useState("")
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDelete = async () => {
        const ok = confirm("선택한 피드를 삭제하시겠습니까?")

        if (!ok || user?.uid !== userId) return; // 삭제 취소하거나, 로그인한 유저와 작성자가 다른 경우 (종료)

        try {
            await deleteDoc(doc(db, "feeds", id));

            if (photo) {
                const photoRef = ref(storage, `feeds/${user.uid}/${id}`);
                await deleteObject(photoRef)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const toggleUpdateState = () => {
        // 함수형 업데이트 (setState)
        setIsUpdating(prev => !prev)
    }

    const onChangeUpdateText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUpdateText(e?.target.value)
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user || updateText === "" || updateText.length > 100) return;

        try {
            setIsLoading(true)

            await updateDoc(doc(db, "feeds", id), {
                feed: updateText,
                userId: user.uid,
            })

            // 리셋
            setUpdateText("")
            toggleUpdateState()

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Wrapper>
            {/* 3 그리드 */}
            <Column>
                <UserName>{userName}</UserName>

                {
                    isUpdating ? 
                    <Form onSubmit={onSubmit}>
                        <TextArea onChange={onChangeUpdateText} placeholder='Write...' maxLength={180} value={updateText} />

                        <SubmitBtn type="submit" value={isLoading ? "Update..." : "Update Feed"} />
                    </Form>

                    :

                    <FeedText>{feed}</FeedText>
                    }

                {
                    user?.uid === userId && !isUpdating ? (
                        <div>
                            <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
                            <UpdateButton onClick={toggleUpdateState}>Update</UpdateButton>
                        </div>
                    ) : <div onClick={toggleUpdateState}>취소</div>
                }
            </Column>

            {/* 1 그리드 */}
            {
                photo &&
                <Column>
                    <Photo src={photo} />
                </Column>
            }

        </Wrapper>
    )
}