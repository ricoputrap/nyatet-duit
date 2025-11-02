import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Props {
  id: string,
  title: string,
  defaultValue?: string,
  placeholder?: string,
  required?: boolean,
  autoFocus?: boolean,
}

export default function TextField({
  id,
  title,
  defaultValue,
  placeholder,
  required,
  autoFocus
}: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {title}
      </Label>
      <Input
        id="name"
        name="name"
        defaultValue={defaultValue || ''}
        placeholder={placeholder || ''}
        className="h-11"
        required={required}
        autoFocus={autoFocus}
      />
    </div>
  )
}
