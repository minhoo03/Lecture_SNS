import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import styled from "styled-components";
import Feed from "./feed";
import { Unsubscribe } from "firebase/auth";

export interface IFeed {
    id: string;
    feed: string;
    userId: string;
    userName: string;
    createdAt: number;
    photo?: string;
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

export default function Timeline() {
    // 쿼리대로 DB에서 얻어온 값 -> 상태 저장
    const [feeds, setFeeds] = useState<IFeed[]>([]);

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;

        const fetchFeeds = async () => { // 데이터 페칭
            const feedsQuery = query( // 어떤 쿼리를 원하는지
                collection(db, "feeds"), // feed 컬렉션에서
                orderBy("createdAt", "desc") // 최신 순으로 (내림차)
            )
    
            // DB에 변동사항이 생길 때마다, 다시 setState
            unsubscribe = await onSnapshot(feedsQuery, (snapshot) => {
                const feedsArr = snapshot.docs.map((doc) => {
                    const { feed, userId, userName, createdAt, photo } = doc.data();
    
                    return {
                        id: doc.id,
                        feed,
                        userId,
                        userName,
                        createdAt,
                        photo
                    }
                })
    
                setFeeds(feedsArr)
            })
        }
    
        fetchFeeds() // 데이터 페칭

        return () => {
            if (unsubscribe) {
                unsubscribe()
                console.log('구독 취소')
            }
        }
    }, [])

    
    return (
        <Wrapper>
            {feeds.map((feed) => (
                <Feed key={feed.id} {...feed} />
            ))}
        </Wrapper>
    )
}

