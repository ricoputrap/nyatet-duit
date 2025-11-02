"use client";

import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

interface Props {
  isEdit: boolean;
  close: () => void;
}

export default function ActionButtons({ isEdit, close }: Props) {
  const { pending } = useFormStatus();

  const label = isEdit ?
    pending ? 'Updating...' : 'Update' :
    pending ? 'Creating...' : 'Create';

  return (
    <div className="flex gap-3">
      <Button
        type="submit"
        className="flex-1 h-11 font-medium"
        disabled={pending}
      >
        {label}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={close}
        className="flex-1 h-11"
      >
        Cancel
      </Button>
    </div>
  )
}
