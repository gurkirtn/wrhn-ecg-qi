import { handleImageOptimization } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };

  IMAGES: {
    input(stream: ReadableStream<Uint8Array>): {
      transform(options: Record<string, unknown>): {
        output(options: {
          format: string;
          quality: number;
        }): Promise<{
          response(): Response;
        }>;
      };
    };
  };
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      return handleImageOptimization(request, {
        fetchAsset: (path: string) => {
          const assetUrl = new URL(path, request.url);
          return env.ASSETS.fetch(new Request(assetUrl));
        },

        transformImage: async (
          body: ReadableStream<Uint8Array>,
          options: {
            width: number;
            format: string;
            quality: number;
          }
        ): Promise<Response> => {
          const { width, format, quality } = options;

          const result = await env.IMAGES
            .input(body)
            .transform(width > 0 ? { width } : {})
            .output({ format, quality });

          return result.response();
        },
      });
    }

    return handler.fetch(request);
  },
};

export default worker;