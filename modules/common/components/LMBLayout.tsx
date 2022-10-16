import { Box, Flex } from "@chakra-ui/react";

import LMBHeader from "./LMBHeader";

const LMBLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Flex
      position="fixed"
      top="0px"
      left="0px"
      bottom="0px"
      right="0px"
      overflowY="auto"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
    >
      <Box maxW="512px">
        <LMBHeader />
        <Box width="100%">{children}</Box>
      </Box>
    </Flex>
  );
};

export default LMBLayout;
