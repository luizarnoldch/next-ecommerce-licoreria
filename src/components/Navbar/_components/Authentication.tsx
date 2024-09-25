import { UserRound } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

type AuthenticationProps = {
  className?: string
}

const Authentication: React.FC<AuthenticationProps> = ({ className }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserRound className="size-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        <DropdownMenuLabel>Authenticate</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={'/signup'}>
            <p>Sign Up</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={'/signin'}>
            <p>Sign In</p>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Authentication
