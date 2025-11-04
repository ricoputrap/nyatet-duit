import { Label } from '@/components/ui/label';
import { DatePicker } from "@/components/ui/date-picker"

interface Props {
  id: string;
  title: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledDates?: (date: Date) => boolean;
}

export default function DateField({
  id,
  title,
  date,
  onDateChange,
  placeholder,
  disabled,
  disabledDates
}: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {title}
      </Label>
      <DatePicker
        date={date}
        onDateChange={onDateChange}
        placeholder={placeholder || "Select date"}
        disabled={disabled}
        disabledDates={disabledDates}
        className="h-11"
      />
    </div>
  )
}
