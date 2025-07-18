import Footer from '@/components/footer';
import Header from '@/components/header';
import { PropsWithChildren } from 'react';

const Layout = (props: PropsWithChildren) => {
  return (
    <div className="mx-auto max-w-5xl px-2 md:pt-2 flex-grow">
      <Header />
      <main className="pb-20 md:pb-8">{props.children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
