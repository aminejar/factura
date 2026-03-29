"use server";

import { cookies } from "next/headers";

export function isLoggedIn() {
  const user = cookies().get("facturaa_auth")?.value;
  return Boolean(user);
}
