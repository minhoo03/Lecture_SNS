import { auth } from "../firebase"

const Home = () => {

    const Logout = () => {
        // 현재 인증 인스턴스 버림
        auth.signOut();
    }

    return (
        <h1>
            <button onClick={Logout}>Log out</button>
        </h1>
    )
}


export default Home

// export default function Home() {
//     return <h2>Home</h2>
// }