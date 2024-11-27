import { appendVideoToDomAndPlay, fetchVideo } from "fake-external-lib";
import { useEffect, useState } from "react";

type Status =
  | {
      status: "error";
      error: Error;
    }
  | {
      status: "loading" | "loaded";
    };

export const useLoadAsyncVideo = (src: string) => {
  const [state, setState] = useState<Status>({
    status: "loading",
  });

  useEffect(() => {
    setState({ status: "loading" });

    let cancelled = false;

    fetchVideo(src)
      .then((blob) => {
        if (cancelled) {
          return;
        }

        appendVideoToDomAndPlay(blob);

        setState({ status: "loaded" });
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        setState({ status: "error", error });
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  // @ts-expect-error
  setState({ status: "error" });

  // @ts-expect-error
  setState({ status: "loading", error: new Error("error") });

  // @ts-expect-error
  setState({ status: "loaded", error: new Error("error") });

  if (state.status === "error") {
    console.error(state.error);
  }
};
