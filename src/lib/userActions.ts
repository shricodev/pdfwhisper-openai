"use client";

import { Hanko } from "@teamhanko/hanko-elements";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL ?? "";
const hanko = new Hanko(hankoApi);

export function isUserLoggedIn() {
  return !!hanko.session.isValid();
}

export async function logOut() {
  return await hanko.user.logout();
}

export async function getUserData() {
  return await hanko.user.getCurrent();
}
