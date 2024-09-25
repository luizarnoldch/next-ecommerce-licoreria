// Utils
import { cn } from '@/lib/utils'

// Icons

// Shared Componets
import Logo from '../_components/Logo'
import Navigation from '../_components/Navigation'
import SearchBar from '../_components/SearchBar'
import ShoppingCar from '../_components/ShoppinCard'
import Authentication from '../_components/Authentication'

type NavbarDesktopProps = {
  className: string
}

const NavbarDesktop: React.FC<NavbarDesktopProps> = ({ className }) => {
  return (
    <div className={cn(className, 'h-16')}>
      <div className="flex justify-between items-center py-4 px-2">
        {/* Logo */}
        <Logo />
        {/* Navigation */}
        <Navigation />
        {/* Search */}
        <SearchBar />

        <div className="flex gap-4">
          {/* ShoppingCar */}
          <ShoppingCar />
          {/* Authentication */}
          <Authentication />
        </div>
      </div>
    </div>
  )
}

export default NavbarDesktop
