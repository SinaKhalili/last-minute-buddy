import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Account from "../modules/auth/components/Account";
import { supabase } from "../modules/database/supabase";

export default function AccountPage() {
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

  return !session ? (
    <div>No session :pepeSadge:</div>
  ) : (
    <Account key={session.user.id} session={session} />
  );
}
