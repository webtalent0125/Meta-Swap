import type { ReactNode } from 'react';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <>
    {props.meta}
    <main className="container text-title">
      <div className="flex h-screen w-[100%] items-center justify-center">
        {props.children}
      </div>
    </main>
  </>
);

export { Main };
