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
      flexDir="column"
    >
      <LMBHeader />
      <div>{children}</div>
    </Flex>
  );
};

export default LMBLayout;
