import { create } from "zustand"

interface useLoginModalStoreProps {
  isOpen: boolean

  onOpen: () => void
  onClose: () => void
}
export const useLoginModal = create<useLoginModalStoreProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
