import {cn} from "@/lib/utils"
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
interface SelectProps {
  items?: selectItemType[];
  placeholder?: string;
  value: any;
  setState: (value: any) => void;
  className?: string;
  name?: string;
  disabled?: boolean;
}

export default function SelectComponent({
  items = [],
  placeholder = "Chọn...",
  value,
  setState,
  className = "",
  name,
  disabled = false
}: SelectProps) {
  return (
    <div className={cn("w-full", className)}>
      <Select 
        value={value} 
        onValueChange={(val) => !disabled && setState(val)} 
        name={name}
        disabled={disabled}
      >
        <SelectTrigger className={cn(
          "w-full",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.length > 0 ? (
            items.map((item, index) => (
              <SelectItem key={index} value={item.value}>
                {item.content}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="None" disabled>
              Không có dữ liệu
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
