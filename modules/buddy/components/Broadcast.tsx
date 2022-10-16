import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { Session } from "@supabase/supabase-js";
import { supabase } from "../../database/supabase";
import { useRouter } from "next/router";

export const Broadcast = ({ session }: { session: Session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");
  const [lookingForBuddy, setLookingForBuddy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getCurrentUser() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session?.user) {
      throw new Error("User not logged in");
    }

    return session.user;
  }

  async function getProfile() {
    try {
      setLoading(true);
      const user = await getCurrentUser();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, lookingForBuddy, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setLookingForBuddy(data.lookingForBuddy);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateLookingForBuddy(lookingForBuddy: boolean) {
    try {
      setLoading(true);
      const user = await getCurrentUser();

      const updates = {
        id: user.id,
        lookingForBuddy,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      } else {
        setLookingForBuddy(lookingForBuddy);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Flex flexDir="column" alignItems="center">
      {lookingForBuddy ? (
        <>
          <Image src="https://media.tenor.com/4MsBgyiY65YAAAAi/cat-peach.gif" />
          <Text>searching for buddy...</Text>
          <Button
            mt="16px"
            width="100%"
            onClick={() => {
              updateLookingForBuddy(false);
            }}
          >
            Cancel search
          </Button>
        </>
      ) : (
        <>
          <Text>
            Someone cancelled on the last minute? Let us help you find your next
            movie date, travel buddy, or workout pal.
          </Text>
          <Button
            mt="16px"
            width="100%"
            onClick={() => {
              updateLookingForBuddy(true);
            }}
          >
            I need a last minute buddy!
          </Button>
          <Button
            mt="16px"
            width="100%"
            onClick={() => {
              router.push("/account");
            }}
          >
            Go to profile
          </Button>
        </>
      )}
      <button
        onClick={() => {
          fetch("/refresh").then((v) => console.log(v));
        }}
      >
        refresh
      </button>
    </Flex>
  );
};
