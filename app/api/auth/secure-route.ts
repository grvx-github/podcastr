// /pages/api/secure-route.ts

import { verifyIdToken } from "../../../lib/middleware"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const decodedToken = await verifyIdToken(req, res)

  if (!decodedToken) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  // Proceed with your secured logic
  res.status(200).json({ message: "You have access!" })
}
