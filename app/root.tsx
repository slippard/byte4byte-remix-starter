import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { getUser } from "~/session.server";

import mainStyles from './styles/main.css'
import stylesheet from "./styles/tailwind.css";
import { isDev } from "./utils";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: mainStyles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  const dev = isDev()
  const gaTrackingId = 'G-XXXXXXXXXX'
  return { user, dev, gaTrackingId };
};

export default function App() {
  const data = useLoaderData<typeof loader>()
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="slippard" />
        <meta name="apple-mobile-web-app-title" content="slippard" />
        <meta name="theme-color" content="#333" />
        <meta name="msapplication-navbutton-color" content="#333" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="msapplication-starturl" content="/" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <link rel="icon" type="image/png" sizes="512x512" href="https://nyc3.digitaloceanspaces.com/slippard/assets/enso-512-inverted.png" />
        <link rel="apple-touch-icon" type="image/png" sizes="512x512" href="https://nyc3.digitaloceanspaces.com/slippard/assets/enso-512-inverted.png"></link>
        <Meta />
        <link rel="manifest" href="https://nyc3.digitaloceanspaces.com/slippard/assets/manifest.json" />

        {/* Plausible script */}
        {data.dev ? null :
          <script defer data-domain="byte4byte-remix-starter.fly.dev" src="https://plausible.io/js/script.js"></script>
        }

        <Meta />
        <Links />
      </head>
      <body className="h-full spectral">
        {data.dev ? null :
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${data.gaTrackingId}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${data.gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
          </>
        }
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
