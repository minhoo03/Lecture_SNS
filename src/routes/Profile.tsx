import styled from "styled-components"
import { auth, db, storage } from "../firebase"
import React, { useEffect, useState } from "react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { IFeed } from "../components/timeline"
import Feed from "../components/feed"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`

const AvatarUpload = styled.label`
    width: 80px;
    height: 80px;
    overflow: hidden;
    border: 1px solid #000;
    border-radius: 50%;
    background-color: snow;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
`

const AvatarImg = styled.img`
    width: 100%;
`
const AvatarInput = styled.input`
    display: none;
`
const Name = styled.span`
    font-size: 24px;
`

const Feeds = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL) // 로그인 된 유저의 사진 URL을 초기값으로 지정할 것
    const [feeds, setFeeds] = useState<IFeed[]>([])

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;

        // 로그인 상태가 아닌 경우, 종료
        if (!user) return

        // 파일을 1개 업로드 한 경우
        if (files && files.length === 1) {
            // 파일을 storage에 저장
            const file = files[0]

            // 사진을 저장하려는 경로
            const locationRef = ref(storage, `avatar/${user.uid}`)

            // 저장
            const result = await uploadBytes(locationRef, file)
            const avatartURL = await getDownloadURL(result.ref)

            // profile 업데이트 (DB)
            await updateProfile(user, {
                photoURL: avatartURL
            })

            setAvatar(avatartURL)
        }
    }

    const fetchFeeds = async () => {
        // 쿼리 작성
        const feedQuery = query(
            collection(db, "feeds"), // 어떤 DB
            where("userId", "==", user?.uid), // 조건
            orderBy("createdAt", "desc"), // 최신순
            limit(25) // 최대 25개까지
        )

        const snapshot = await getDocs(feedQuery) // 쿼리대로 스냅샷 얻어왔고
        const feedsData = snapshot.docs.map((doc) => {
            const { feed, createdAt, userId, userName, photo } = doc.data();

            return {
                feed,
                createdAt,
                userId,
                userName,
                photo,
                id: doc.id
            }
        })

        setFeeds(feedsData)
    }

    useEffect(() => {
        fetchFeeds()
    }, [])

    return (
        <Wrapper>
            <AvatarUpload htmlFor="avatar">
                {
                    avatar? 
                    <AvatarImg src={avatar} />
                    :
                    <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                  </svg>
                }
                
            </AvatarUpload>
            <AvatarInput
                type="file"
                accept="image/*"
                id="avatar"
                onChange={handleAvatarChange}
            />
            <Name>{user?.displayName ?? "어나니머스"}</Name>

            <Feeds>
                {
                    feeds.map((feed) => (
                        <Feed key={feed.id} {...feed} />
                    ))
                }
            </Feeds>
        </Wrapper>
    )
}