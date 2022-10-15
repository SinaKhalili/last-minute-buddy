import { useEffect, useState } from "react";

import Auth from "../modules/auth/components/Auth";

export default function Home() {
  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <Auth />
    </div>
  );
}
