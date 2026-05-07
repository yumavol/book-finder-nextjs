import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query';
import ToastContainer from '@/components/toast-container';
import { Geist } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <div className={geistSans.variable}>
      <Head>
        <title>Book Finder</title>
        <link rel="icon" href="/images/favicon.png" type="image/png" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </HydrationBoundary>
      </QueryClientProvider>
      <ToastContainer />
    </div>
  );
}
