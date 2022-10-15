import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import LMBLayout from "../modules/common/components/LMBLayout";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <LMBLayout>
        <Component {...pageProps} />
      </LMBLayout>
    </ChakraProvider>
  );
};

export default App;
