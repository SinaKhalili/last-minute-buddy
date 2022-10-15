import { FormEvent, useState } from "react";

import { Box } from "@chakra-ui/react";
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
    <Box>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          className="input-block"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="button block" type="submit" disabled={loading}>
          {loading ? "Loading..." : "Log in"}
        </button>
      </form>
    </Box>
  );
}
