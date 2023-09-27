import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "../components/Layout/Layout";

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
      <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
}
