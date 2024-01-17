import { Link, Outlet, useNavigate } from "react-router-dom";
import { styled } from 'styled-components'
import { auth } from "../firebase";

import HomeIcon from "../atoms/icons/HomeIcon";
import UserIcon from "../atoms/icons/UserIcon";
import ArrowLeftEnd from "../atoms/icons/ArrowLeftEnd";


const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr;
  height: 100%;
  padding: 50px 0px;
  width: 100%;
  max-width: 860px;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  svg {
    width: 30px;
    fill: black;
  }
  &.log-out {
    border-color: tomato;
    svg {
      fill: tomato;
    }
  }
`;


export default function Layout() {
    const navi = useNavigate();

    const onLogOut = async () => {
        const ok = confirm("로그아웃 하시겠습니까?")

        if (ok) {
            // 로그아웃이 완료되면 /login으로 이동
            await auth.signOut();
            navi("/login")
        }
    }


    return (
        <Wrapper>
            <Menu>
                {/* Menu 네비게이션 바 */}
                <Link to="/">
                    <MenuItem>
                        <HomeIcon />
                    </MenuItem>
                </Link>
                <Link to="/profile">
                    <MenuItem>
                        <UserIcon />
                    </MenuItem>
                </Link>
                <Link>
                    <MenuItem className="log-out" onClick={onLogOut}>
                        <ArrowLeftEnd />
                    </MenuItem>
                </Link>
            </Menu>
            <Outlet />
      </Wrapper>
    )
}