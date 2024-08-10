import { create} from "zustand"

type Preferences = {
    soundenabled: boolean
    setSoundEnabled: (soundenabled: boolean) => void
}

const usePreferences = create<Preferences>((set) => ({
    soundenabled: true,
    setSoundEnabled: (soundenabled: boolean) => set({ soundenabled }),
}))

export default usePreferences