// src/pages/_app.tsx
import RainbowKitUIProvider from "@/providers/RainbowKitUIProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { ColorSchemeProvider } from "@/contexts/ColorSchemeProvider";
import Menu from "@/components/Menu";

import { AppProps } from 'next/app';

export default function App({ Component, pageProps: { session, ...pageProps } }) {

  return (
    <SessionProvider session={session}>
      <RainbowKitUIProvider>
        <ColorSchemeProvider>
          <Menu />
          <Component {...pageProps} />
        </ColorSchemeProvider>
      </RainbowKitUIProvider>
    </SessionProvider>
  );
}
