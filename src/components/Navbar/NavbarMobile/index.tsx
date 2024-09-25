// Utils
import { cn } from '@/lib/utils'

// Icons

// Shared Componets
import Logo from '../_components/Logo'
import SearchBar from '../_components/SearchBar'
import ShoppingCar from '../_components/ShoppinCard'
import Authentication from '../_components/Authentication'
import BurgerNavigation from '../_components/BurgerNavigation'

type NavbarMobileProps = {
  className: string
}

const NavbarMobile: React.FC<NavbarMobileProps> = ({ className }) => {
  return (
    <div
      className={cn(
        className,
        'w-full flex flex-col gap-2 justify-center items-center p-2 px-4'
      )}
    >
      {/* Navgiation Bar */}
      <div className="w-full h-12 flex justify-between items-center">
        {/* Logo */}
        <Logo />
        {/* Navigation */}
        <BurgerNavigation />

        {/* Shop + Auth */}
        <div className="flex justify-center items-center gap-4">
          {/* ShoppingCar */}
          <ShoppingCar />
          {/* Authentication */}
          <Authentication />
        </div>
      </div>

      {/* SearchBar */}
      <div className="w-full h-12 flex justify-center items-center">
        {/* Search */}
        <SearchBar />
      </div>
    </div>
  )
}

export default NavbarMobile
