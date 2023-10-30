import { PropsWithChildren } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Header from "@/components/header";

export function Layout(props: PropsWithChildren) {
  return (
    <div className="mx-auto max-w-5xl px-2">
      <Header />
      <main>{props.children}</main>
    </div>
  );
}
