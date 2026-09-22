import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

const RouterContext = createContext({ path: "/", navigate: () => {} });

const toTop = () => (window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0));

export function RouterProvider({ children }) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to) => {
    if (to === window.location.pathname) return;
    const go = () => {
      window.history.pushState({}, "", to);
      setPath(to);
      toTop();
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduce) {
      document.documentElement.dataset.vt = "page";
      const vt = document.startViewTransition(() => flushSync(go));
      vt.finished.finally(() => delete document.documentElement.dataset.vt);
    } else {
      go();
    }
  }, []);

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export const useRouter = () => useContext(RouterContext);

// Regular <a> that navigates without a reload. Cmd/Ctrl-click still opens a new tab.
export function Link({ to, onClick, children, ...rest }) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
