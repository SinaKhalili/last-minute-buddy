import { Session } from "@supabase/supabase-js";
import Head from "next/head";
import { useEffect, useState } from "react";
import StitchesLogo from "../components/StitchesLogo";
import Account from "../modules/auth/components/Account";
import Auth from "../modules/auth/components/Auth";
import { supabase } from "../modules/database/supabase";
import { styled } from "../stitches.config";

const Box = styled("div", {});

const Text = styled("p", {
  fontFamily: "$system",
  color: "$hiContrast",
});

const Link = styled("a", {
  fontFamily: "$system",
  textDecoration: "none",
  color: "$emerald700",
});

const Container = styled("div", {
  marginX: "auto",
  paddingX: "$3",

  variants: {
    size: {
      1: {
        maxWidth: "300px",
      },
      2: {
        maxWidth: "585px",
      },
      3: {
        maxWidth: "865px",
      },
    },
  },
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // only update the react state if the component is still mounted
      if (mounted) {
        if (session) {
          setSession(session);
        }

        setIsLoading(false);
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      mounted = false;

      subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <Auth />
      ) : (
        <Account key={session.user.id} session={session} />
      )}
    </div>
  );
}
