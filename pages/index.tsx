import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import Auth from "../modules/auth/components/Auth";
import { Broadcast } from "../modules/buddy/components/Broadcast";
import { supabase } from "../modules/database/supabase";

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
      {session ? <Broadcast session={session} /> : <Auth />}
    </div>
  );
}
