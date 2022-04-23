import { Html, Head, Main, NextScript } from 'next/document';
import { Navbar } from './components/Navbar';

export default function Document() {
  return (
    <Html className="bg-blue-100">
      <Head />
      <body>
        <Navbar />
        <div className="relative">
          <Main />
        </div>
        <NextScript />
      </body>
    </Html>
  );
}
