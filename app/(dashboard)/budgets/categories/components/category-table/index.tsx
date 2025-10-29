import { getCategories } from '../../actions'
import { DataTable } from './data-table';
import { columns } from './columns';
import { ICategoryPageParams } from '../../types';

interface Props {
  params: Promise<ICategoryPageParams>;
}

export default async function CategoryTable({ params }: Props) {
  const resolvedParams = await params;
  const categories = await getCategories(resolvedParams);

  return (
    <DataTable columns={columns} data={categories} />
  )
}
