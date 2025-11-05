import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Props {
  id: string;
  title: string;
  defaultValue?: number;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  step?: string;
  min?: string;
}

export default function NumberField({
  id,
  title,
  defaultValue,
  value,
  onChange,
  placeholder,
  required,
  step = "0.01",
  min = "0"
}: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {title}
      </Label>
      <Input
        id={id}
        name={id}
        type="number"
        step={step}
        min={min}
        placeholder={placeholder || "0"}
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-11"
        required={required}
      />
    </div>
  )
}
