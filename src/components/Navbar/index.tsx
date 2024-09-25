import React from 'react'
import NavbarDesktop from './NavbarDesktop'
import NavbarMobile from './NavbarMobile'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <header className="w-full h-full bg-primary-foreground">
      <div className="container w-full h-full mx-auto">
        <NavbarDesktop className="lg:block hidden text-primary" />
        <NavbarMobile className="lg:hidden text-primary" />
      </div>
    </header>
  )
}

export default Navbar
