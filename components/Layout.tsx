import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <Box>
    <Header />
    <Box p={5} minH="100vh">
      {props.children}
    </Box>
    <Footer />
  </Box>
);

export default Layout;
