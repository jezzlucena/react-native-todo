import { Color } from "./Color"

export type Task = {
  id: number,
  completed: boolean,
  text: string,
  focusOnMount?: boolean
}