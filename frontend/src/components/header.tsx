import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Header() {
  return (
    <header className="flex justify-between align-middle py-4">
      <div className="flex justify-center flex-col">
        <h1 className="">Aminals</h1>
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Example Nav Item
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <ConnectButton />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
