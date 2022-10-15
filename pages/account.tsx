import { useEffect, useState } from "react";

import Account from "../modules/auth/components/Account";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../modules/database/supabase";
import { useRouter } from "next/router";

export default function AccountPage() {
  const router = useRouter();
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
        } else {
          router.push("/");
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

  return !session ? null : <Account key={session.user.id} session={session} />;
}
