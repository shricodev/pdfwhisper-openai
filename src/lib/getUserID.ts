import { cookies } from "next/headers";
import * as jose from "jose";

export async function getUserId() {
  const token = cookies().get("hanko")?.value;
  const payload = jose.decodeJwt(token ?? "");

  const userID = payload.sub;
  return userID;
}
