import { useEffect } from "react";
import useToastStore from "../../store/toast"

export const useToast = () => {
    const { isShowing, toggleShowing, changeText } = useToastStore();

    // 특정 이벤트 후 화면에 나타낼 토스트를 정의하는 부분
    const showToast = (txt: string) => {
        toggleShowing()
        changeText(txt)
    }

    useEffect(() => {
        const calcTime = async () => {
            if (isShowing) { // 현재 화면에 토스트가 나타났을 경우
                
                const timerId = setTimeout(() => {
                    toggleShowing() // 토스트 상태를 false로 바꿈
                    changeText("")

                    console.log("3초가 지나 토스트가 사라졌습니다.")
                }, 3000);

                // setTimeout 제거
                return () => clearTimeout(timerId)
            }
        }

        calcTime()
    }, [isShowing])

    return { showToast }
}