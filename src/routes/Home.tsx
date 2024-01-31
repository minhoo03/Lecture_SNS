import styled from "styled-components"
import PostWriteForm from "../components/post-write-form"
import Timeline from "../components/timeline"

const Wrapper = styled.div`
    display: grid;
    gap: 50px;
    overflow-y: scroll;
    grid-template-rows: 1fr 5fr;
`

const Home = () => {
    return (
        <Wrapper>
            <PostWriteForm />
            <Timeline />
        </Wrapper>
    )
}


export default Home

// export default function Home() {
//     return <h2>Home</h2>
// }