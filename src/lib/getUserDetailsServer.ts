import * as jose from "jose";
import { cookies } from "next/headers";

export async function getUserId() {
  const token = cookies().get("hanko")?.value;
  const payload = jose.decodeJwt(token ?? "");
  if (!payload.sub) return null;
  const userID = payload.sub;
  if (!userID) return null;
  return userID;
}

export async function isAuth() {
  const token = cookies().get("hanko")?.value;

  if (token) {
    const payload = jose.decodeJwt(token);
    return !!payload.sub;
  }
  return false;
}
