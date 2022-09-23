import Head from 'next/head';
import { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<MantineProvider
				theme={{
					colorScheme: 'dark',
				}}
				withGlobalStyles
				withNormalizeCSS
			>
				<Head>
					<title>Pokemon Log Viewer</title>
					<meta
						name="viewport"
						content="initial-scale=1.0, width=device-width"
					/>
				</Head>
				<Component {...pageProps} />
			</MantineProvider>
		</>
	);
}

export default MyApp;
