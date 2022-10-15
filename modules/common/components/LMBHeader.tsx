import { Box, Flex, Heading } from "@chakra-ui/react";

import Image from "next/image";
import Logo from "../images/logo.png";

const LMBHeader = () => {
  return (
    <Flex py="16px" pt="16px" flexDir="column" alignItems="center">
      <Box>
        <Image src={Logo} />
      </Box>
      <Heading>Last Minute Buddy</Heading>
    </Flex>
  );
};

export default LMBHeader;
