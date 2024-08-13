import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context";
import { use, useEffect } from "react";

export const useInterceptAppRouter = <TMethod extends keyof AppRouterInstance>(
  method: TMethod,
  interceptFn: (
    original: AppRouterInstance[TMethod],
    ...args: Parameters<AppRouterInstance[TMethod]>
  ) => void,
) => {
  const appRouter = use(AppRouterContext);

  useEffect(() => {
    if (!appRouter)
      throw new Error(
        "useInterceptAppRouter must be used within an App Router context",
      );
    const originalMethod = appRouter[method];

    appRouter[method] = ((...args: Parameters<AppRouterInstance[TMethod]>) => {
      interceptFn(originalMethod, ...args);
    }) as AppRouterInstance[TMethod];

    return () => {
      appRouter[method] = originalMethod;
    };
  }, [appRouter, method, interceptFn]);
};

export const usePageUnMount = (handler: () => void) => {
  useEffect(() => {
    const handlePageLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault(); //native chrome alert will be triggered
      handler();
    };

    window.addEventListener("beforeunload", handlePageLeave);

    return () => {
      window.removeEventListener("beforeunload", handlePageLeave);
    };
  }, [handler]);

  const handleIntercept = (proceed: () => void) => {
    handler();
    proceed();
  };

  useInterceptAppRouter("push", (original, ...args) => {
    handleIntercept(() => original(...args));
  });

  useInterceptAppRouter("replace", (original, ...args) => {
    handleIntercept(() => original(...args));
  });
};
