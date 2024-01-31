import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { styled } from 'styled-components';
import { auth, db, storage } from '../firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

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

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

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

    const [file, setFile] = useState<File | null>(null);
    
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFeed(e.target.value)
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target

        if (files && files.length === 1) {
            setFile(files[0])
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 새로고침 방지

        // 로그인 여부
        const user = auth.currentUser;

        // 로그인이 안되었거나, 빈 값으로 서브밋 한 경우 (submit 취소)
        if(!user || feed === "") return;

        try {
            setIsLoading(true)
            const doc = await addDoc(collection(db, "feeds"), { // db의 feeds 콜렉션에 document 추가, { 추가할 데이터 }
                feed,
                createdAt: Date.now(),
                userName: user.displayName || "human",
                userId: user.uid
            })

            // 파일 유무
            if (file) {
                // 업로드 된 파일이 저장되는 폴더명과 파일명 지정
                const locationRef = ref(
                    storage, // 인스턴스
                    `feeds/${user.uid}-${user.displayName}/${doc.id}`// feeds/각 유저의 고유 폴더/파일명
                )

                const result = await uploadBytes(locationRef, file) // 어떤 파일을 어디에 저장할 것인지
                // promise 반환 -> 업로드 결과에 대한 참조
                const url = await getDownloadURL(result.ref)

                await updateDoc(doc, {
                    photo: url
                })
            }

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

            <AttachFileButton htmlFor="file">
                {file ? "Photo added" : "Add photo"}
            </AttachFileButton>

            <AttachFileInput
                onChange={onFileChange}
                type="file"
                id="file"
                accept="image/*"
            />

            <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Feed"} />
        </Form>
    )
}

export default PostWriteForm