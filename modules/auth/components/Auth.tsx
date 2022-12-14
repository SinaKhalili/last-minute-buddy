import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormHelperText,
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
  const [sent, setSent] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: "https://last-minute-buddy-r5cy.vercel.app/account",
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (error: any) {
      console.log(error.error_description, error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box px="16px">
      <Box>
        <Text>
          Someone cancelled on the last minute? Let us help you find your next
          movie date, travel buddy, or workout pal. We'll send you a magic link
          to log in.
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

          <Button
            type="submit"
            disabled={loading || email.length < 1}
            mt="16px"
            width="100%"
          >
            {loading ? <Spinner size="xs" /> : "Log in"}
          </Button>
        </form>
        {sent ? (
          <Alert status="success" mt="16px">
            <AlertIcon />
            Magic link was sent to your email! Check your inbox.
          </Alert>
        ) : null}
      </Box>
    </Box>
  );
}
