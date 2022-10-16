import { withApiAuth } from "@supabase/auth-helpers-nextjs";

export default withApiAuth(async function ProtectedRoute(
  req,
  res,
  supabaseServerClient
) {
  // Run queries with RLS on the server
  const { data } = await supabaseServerClient.from("profiles").select("*");
  res.json(data);
});
