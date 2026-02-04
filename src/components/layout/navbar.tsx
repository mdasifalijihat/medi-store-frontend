"use client";

import { Menu, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getUser } from "@/lib/auth"; // getUser -> localStorage থেকে user info নেয়া
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
  logo?: {
    url: string;
    src?: string;
    alt?: string;
    title?: string;
    className?: string;
  };
  menu?: MenuItem[];
}

export const Navbar = ({
  logo = { url: "/", alt: "logo", title: "MediStore" },
  menu = [
    { title: "Home", url: "/" },
    { title: "Shop", url: "/shop" },
    { title: "Blog", url: "/blog" },
  ],

  className,
}: NavbarProps) => {
  const [user] = useState(() => getUser());

  console.log(user)


  return (
    <section className={cn("py-4", className)}>
      <div className="container">
        {/* Desktop */}
        <nav className="hidden lg:flex items-center justify-between">
          <Link
            href={logo.url}
            className="flex items-center gap-2 font-bold text-lg"
          >
            {logo.title}
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              {menu.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink href={item.url}>
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-1 px-3 py-1 rounded hover:bg-muted"
              >
                <UserIcon className="w-5 h-5" />
                <span className="hidden md:inline">{user.name}</span>
              </Link>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile */}
        <div className="flex lg:hidden justify-between items-center">
          <Link href={logo.url} className="font-bold text-lg">
            {logo.title}
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{logo.title}</SheetTitle>
              </SheetHeader>

              <Accordion
                type="single"
                collapsible
                className="flex flex-col gap-2"
              >
                {menu.map((item) => (
                  <AccordionItem key={item.title} value={item.title}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>
                      {item.items?.map((sub) => (
                        <Link key={sub.title} href={sub.url}>
                          {sub.title}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-4 flex flex-col gap-2">
                {user ? (
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-1 rounded hover:bg-muted"
                  >
                    <UserIcon className="w-5 h-5" /> {user.name}
                  </Link>
                ) : (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};
