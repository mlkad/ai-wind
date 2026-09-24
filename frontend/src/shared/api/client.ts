import { i18n } from "@/shared/i18n";
import { API_BASE_URL, API_TIMEOUT_MS } from "./config";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ErrorBody = { detail?: unknown };

function extractErrorMessage(body: unknown, fallback: string): string {
  if (typeof body !== "object" || body === null) return fallback;
  const { detail } = body as ErrorBody;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item: unknown) => (typeof item === "object" && item !== null && "msg" in item ? String(item.msg) : null))
      .filter((message): message is string => message !== null);
    if (messages.length > 0) return messages.join("; ");
  }
  return fallback;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  signal?: AbortSignal;
};

/**
 * Typed JSON request to the WindAI API. The generic `T` is the response DTO;
 * mapping to domain types happens in each entity's api layer.
 */
export async function apiRequest<T>(path: string, { method = "GET", body, signal }: RequestOptions = {}): Promise<T> {
  const timeout = AbortSignal.timeout(API_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new ApiError(0, i18n.t("The WindAI server did not respond in time. Please try again."));
    }
    throw new ApiError(0, i18n.t("Cannot connect to the WindAI server. Please try again."));
  }

  const payload = await readJson(response);
  if (!response.ok) {
    throw new ApiError(
      response.status,
      extractErrorMessage(payload, i18n.t("Request failed ({{status}}).", { status: response.status })),
    );
  }
  return payload as T;
}
