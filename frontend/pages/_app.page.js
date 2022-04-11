import '../styles/globals.css';
import SignerContext from './contexts/SignerContext';

function MyApp({ Component, pageProps }) {
  return (
    <SignerContext>
      <div className="container max-w-xl mx-auto mt-6 bg-white rounded-lg shadow-lg p-6">
        <Component {...pageProps} />
      </div>
    </SignerContext>
  );
}

export default MyApp;
