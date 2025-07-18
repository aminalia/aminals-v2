import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useHasMounted } from '@/hooks/useHasMounted';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useAccount } from 'wagmi';

export default function Header() {
  const hasMounted = useHasMounted();
  const { address } = useAccount();

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex justify-between items-center py-4">
        <div className="flex justify-center flex-col">
          <Link href="/">
            <h1 className="text-xl font-bold">👾 Aminals</h1>
          </Link>
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/breeding">💕 Breeding</Link>
              </NavigationMenuLink>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/genes">🧬 Genes</Link>
              </NavigationMenuLink>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/leaderboard">🏆 Leaderboard</Link>
              </NavigationMenuLink>
              {hasMounted && address && (
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={`/profile/${address}`}>👤 Profile</Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
            <NavigationMenuItem>
              {hasMounted ? (
                <ConnectButton />
              ) : (
                <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center py-2 px-4">
        <Link href="/">
          <h1 className="text-xl font-bold">👾 Aminals</h1>
        </Link>
        {hasMounted ? (
          <ConnectButton />
        ) : (
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-sm border-t z-50 shadow-lg">
        <div
          className={`grid gap-1 p-2 ${
            hasMounted && address ? 'grid-cols-5' : 'grid-cols-4'
          }`}
        >
          <Link
            href="/"
            className="flex flex-col items-center justify-center p-2 hover:bg-accent rounded-lg"
          >
            <span className="text-2xl">👾</span>
            <span className="text-xs mt-1">Aminals</span>
          </Link>
          <Link
            href="/breeding"
            className="flex flex-col items-center justify-center p-2 hover:bg-accent rounded-lg"
          >
            <span className="text-2xl">💕</span>
            <span className="text-xs mt-1">Breeding</span>
          </Link>
          <Link
            href="/leaderboard"
            className="flex flex-col items-center justify-center p-2 hover:bg-accent rounded-lg"
          >
            <span className="text-2xl">🏆</span>
            <span className="text-xs mt-1">Leaderboard</span>
          </Link>
          <Link
            href="/genes"
            className="flex flex-col items-center justify-center p-2 hover:bg-accent rounded-lg"
          >
            <span className="text-2xl">🧬</span>
            <span className="text-xs mt-1">Genes</span>
          </Link>
          {hasMounted && address && (
            <Link
              href={`/profile/${address}`}
              className="flex flex-col items-center justify-center p-2 hover:bg-accent rounded-lg"
            >
              <span className="text-2xl">👤</span>
              <span className="text-xs mt-1">Profile</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
