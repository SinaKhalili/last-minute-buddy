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
    listenToNeedBuddy();
  }, [session]);

  async function listenToNeedBuddy() {
    supabase
      .channel("*")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          table: "NeedBuddy",
          schema: "public",
        },
        (payload) => {
          console.log(payload);
        }
      )
      .subscribe();
  }

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

      let { data: data2 } = await supabase
        .from("NeedBuddy")
        .select("needsFriend")
        .eq("id", user.id)
        .single();

      if (data) {
        setUsername(data.username);
        setLookingForBuddy(data2?.needsFriend ?? false);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateLookingForBuddy(needsFriend: boolean) {
    try {
      const user = await getCurrentUser();

      setLoading(true);

      let { data: needsMatch } = await supabase
        .from("NeedBuddy")
        .select("id")
        .eq("needsFriend", true)
        .neq("id", user.id)
        .single();

      if (needsMatch) {
        const updates = {
          id: needsMatch.id,
          needsFriend: false,
          potentialFriend: user.id,
        };

        await supabase.from("NeedBuddy").upsert(updates);
      } else {
        const updates = {
          id: user.id,
          needsFriend,
        };

        let { error } = await supabase.from("NeedBuddy").upsert(updates);

        if (error) {
          throw error;
        } else {
          setLookingForBuddy(needsFriend);
        }
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Flex flexDir="column" alignItems="center" px="16px">
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
    </Flex>
  );
};
