
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type selectItemType ={
  value : any,
  content: string
}
export default function SelectComponent({items, placeholder, state, setState} :
   {items? : selectItemType[], placeholder?: string, state : any, setState : (value : any) => void}) {
  return (
    <div className = "">
        <Select value = {state} onValueChange = {(val) => setState(val)}>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder= {placeholder ?? "Theme"}/>
        </SelectTrigger>
        <SelectContent >
            {items && items.map((item, index) => {
              return(
                <SelectItem  key = {index} value = {item.value} >{item.content}</SelectItem>
                
              )
            })}
        </SelectContent>
        </Select>
    </div>
    
  )
}
