export interface DialogManager {
  register: (id: string) => void
  open: (id: string) => void
  close: (id: string) => void
  state: Record<string, boolean>
}
