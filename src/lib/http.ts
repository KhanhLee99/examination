// import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { toast } from "@/components/ui/use-toast";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

class SessionToken {
  private access_token = "";
  get value() {
    return this.access_token;
  }
  set value(access_token: string) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this.access_token = access_token;
  }
}

export const clientSessionToken = new SessionToken();

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const access_token = localStorage.getItem("access_token");
  const baseHeaders = {
    "Content-Type": "application/json",
    Authorization: access_token ? `Bearer ${access_token}` : "",
  };
  const baseUrl = "https://frontend-exam.digitalfortress.dev";

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };
  if (!res.ok) {
    if (res.status === 401) {
      toast({
        description: (data.payload as any).message,
      });
      throw new Error((data.payload as any).message);
    }
  }
  if (typeof window !== "undefined") {
    if (["auth/login"].some((item) => item === normalizePath(url))) {
      localStorage.setItem(
        "access_token",
        (payload as LoginResType).access_token
      );
    } else if ("auth/logout" === normalizePath(url)) {
      clientSessionToken.value = "";
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
