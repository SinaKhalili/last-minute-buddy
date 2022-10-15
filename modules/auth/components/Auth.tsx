import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";

import { supabase } from "../../database/supabase";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box px="16px">
      <Box>
        <Text>
          Let us help you find your next movie date, travel buddy, or workout
          pal. We'll send you a magic link to log in.
        </Text>
      </Box>

      <Box mt="16px">
        <form onSubmit={handleLogin}>
          <FormControl>
            <FormLabel htmlFor="email">Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <Button type="submit" disabled={loading} mt="16px" width="100%">
            {loading ? <Spinner size="xs" /> : "Log in"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
