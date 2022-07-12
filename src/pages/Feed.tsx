import { FilterProvider } from '../FilterContext';
import Posts from '../Posts';

export const Feed = () => {
  return (
    <FilterProvider>
      <Posts />
    </FilterProvider>
  )
}
