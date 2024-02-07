import styled from "styled-components"
import { auth, db, storage } from "../firebase"
import { deleteDoc, doc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"

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

    // true: deleteDoc + if photo: deleteObject
    // DB를 지워주고 + 이미지를 저장 중인 Storage도 함께 Delete

    return (
        <Wrapper>
            {/* 3 그리드 */}
            <Column>
                <UserName>{userName}</UserName>
                <FeedText>{feed}</FeedText>
                <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
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