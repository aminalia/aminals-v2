import Header from '@/components/header';
import { PropsWithChildren } from 'react';

const Layout = (props: PropsWithChildren) => {
  return (
    <div className="mx-auto max-w-5xl px-2">
      <Header />
      <main>{props.children}</main>
    </div>
  );
};

export default Layout;
