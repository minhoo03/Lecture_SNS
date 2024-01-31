import { create } from "zustand";

interface State {
    isShowing: boolean;
    text: string;
}

// 초깃값
const init: State = {
    isShowing: false,
    text: ""
}

// 상속 받아 확장한 interface
interface SettingFileStore extends State {
    toggleShowing: () => void;
    changeText: (txt: string) => void;
}

// store create
const useToastStore = create<SettingFileStore>((set) => ({
    ...init,

    toggleShowing: () => {
        set((state) => ({
            isShowing: !state.isShowing
        }))
    },
    changeText: (txt) => {
        set({ text: txt })
    }
}))

export default useToastStore