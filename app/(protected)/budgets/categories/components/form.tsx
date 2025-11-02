import React from 'react'
import { toast } from 'sonner';

import { TextField, ActionButtons, useFormSheetStore} from "@/components/form-sheet"
import { createCategory, updateCategory } from '../actions';
import { ICategory } from '../types';


interface Props {
  category?: ICategory;
}

export default function CategoryForm({ category }: Props) {
  const close = useFormSheetStore((state) => state.close);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    if (category) {
      await updateCategory(category.id, name);
      toast.success('Category updated successfully')
    } else {
      await createCategory(name);
      toast.success('Category created successfully')
    }

    // Close the form sheet after submission
    close();
  };

  return (
    <form className="flex flex-col flex-1 px-4 pb-4" onSubmit={handleSubmit}>
      <div className="flex-1 space-y-6">
        <TextField
          id="name"
          title="Category Name"
          defaultValue={category?.name || ''}
          placeholder="Enter category name..."
          required
          autoFocus
        />
      </div>

      <ActionButtons isEdit={!!category} close={close} />
    </form>
  )
}
