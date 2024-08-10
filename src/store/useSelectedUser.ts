import { User } from "@/db/dummy"
import {create} from "zustand"


type selectedUserState = {
    selectedUser: User | null
    setSelectedUser: (selectedUser: User | null) => void
}

export const useSelectedUser = create<selectedUserState>((set)=>({
    selectedUser : null,
    setSelectedUser:(selectedUser:User | null)=>set({selectedUser})
}))