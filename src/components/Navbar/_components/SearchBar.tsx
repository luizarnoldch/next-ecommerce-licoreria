import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import React from 'react'

type Props = {}

const SearchBar = (props: Props) => {
  return (
    <div className="relative flex items-center w-full lg:max-w-80">
      <SearchIcon className="absolute left-3" />
      <Input type="text" placeholder="Busca tu producto" className="pl-10" />
    </div>
  )
}

export default SearchBar
