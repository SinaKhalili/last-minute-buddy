import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../../database/supabase";

export const Broadcast = ({ session }: { session: Session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatar_url, setAvatarUrl] = useState("");
  const [lookingForBuddy, setLookingForBuddy] = useState(false);

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
    <div>
      {lookingForBuddy ? (
        <div>
          <p>searching for buddy...</p>
          <img src="https://media.tenor.com/4MsBgyiY65YAAAAi/cat-peach.gif" />
          <button
            onClick={() => {
              updateLookingForBuddy(false);
            }}
          >
            Cancel search
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            updateLookingForBuddy(true);
          }}
        >
          I need a last minute buddy!
        </button>
      )}
    </div>
  );
};

const handleClick = async () => {};
