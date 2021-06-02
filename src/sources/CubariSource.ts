import { SourceInfo } from "paperback-extensions-common";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

const UNSAFE_HEADERS = new Set(["cookie", "user-agent"]);

const requestInterceptor = (req: AxiosRequestConfig) => {
  const targetUrl = req.url + (req.params ?? "");
  req.url =
    (targetUrl.match(/\[(\d)*\]/g) || []).length > 1
      ? `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`
      : `https://cors.bridged.cc/${targetUrl}`;
  Object.keys(req.headers).forEach((header) => {
    if (UNSAFE_HEADERS.has(header.toLowerCase())) {
      delete req.headers[header];
    }
  });
  return req;
};

const responseInterceptor = (res: AxiosResponse) => {
  if (res.request.responseURL.includes("api.allorigins.win")) {
    res.data = res.data.contents;
    return res;
  } else {
    return res;
  }
};

// Interceptors to preserve the requestManager within each source. Thanks Paper!
axios.interceptors.request.use(requestInterceptor);
axios.interceptors.response.use(responseInterceptor);

type Constructor = new (...args: any[]) => {};

export function CubariSourceMixin<TBase extends Constructor>(
  Base: TBase,
  sourceInfo: SourceInfo,
  getMangaUrlCallback: (slug: string) => string
) {
  return class CubariSource extends Base {
    getMangaUrl = getMangaUrlCallback;

    getSourceDetails = () => {
      return sourceInfo;
    };
  };
}
