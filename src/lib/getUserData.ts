"use client";

import { Hanko } from "@teamhanko/hanko-elements";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL ?? "";
const hanko = new Hanko(hankoApi);

export function isUserLoggedIn() {
  return !!hanko.session.isValid();
}

export default async function getUserData() {
  return await hanko.user.getCurrent();
}
