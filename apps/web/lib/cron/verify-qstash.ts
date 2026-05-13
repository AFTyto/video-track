import { log } from "@dub/utils";
import { Receiver } from "@upstash/qstash";
import { DubApiError } from "../api/errors";

// lazily initialize receiver to avoid build-time errors
let _receiver: Receiver | null = null;

function getReceiver(): Receiver {
  if (!_receiver) {
    _receiver = new Receiver({
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "",
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "",
    });
  }
  return _receiver;
}

export const verifyQstashSignature = async ({
  req,
  rawBody,
}: {
  req: Request;
  rawBody: string;
}) => {
  if (process.env.VERCEL !== "1") {
    return;
  }

  const signature = req.headers.get("Upstash-Signature");

  if (!signature) {
    throw new DubApiError({
      code: "bad_request",
      message: "Upstash-Signature header not found.",
    });
  }

  const receiver = getReceiver();

  const isValid = await receiver.verify({
    signature,
    body: rawBody,
  });

  if (!isValid) {
    const url = req.url;
    const messageId = req.headers.get("Upstash-Message-Id");

    log({
      message: `Invalid QStash request signature: *${url}* - *${messageId}*`,
      type: "errors",
      mention: true,
    });

    throw new DubApiError({
      code: "unauthorized",
      message: "Invalid QStash request signature.",
    });
  }
};
