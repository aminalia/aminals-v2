import { useHasMounted } from '@/hooks/useHasMounted';
import { useAccount } from 'wagmi';
import { Button, ButtonProps } from './button';

interface Web3ButtonProps extends ButtonProps {
  connectMessage?: string;
  actionMessage: string;
  onAction: () => Promise<void>;
}

export function Web3Button({
  connectMessage = 'Connect wallet',
  actionMessage,
  onAction,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}: Web3ButtonProps) {
  const hasMounted = useHasMounted();
  const { isConnected, chain } = useAccount();
  const enabled = hasMounted && isConnected && chain;

  return (
    <Button
      type="button"
      onClick={onAction}
      disabled={!enabled}
      variant={enabled ? variant : 'outline'}
      size={size}
      className={!enabled ? 'text-gray-400 cursor-not-allowed' : className}
      {...props}
    >
      {hasMounted ? (enabled ? actionMessage : connectMessage) : 'Loading...'}
    </Button>
  );
}
