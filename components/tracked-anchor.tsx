"use client";

import { track } from "@/components/analytics-client";

export function TrackedAnchor({
  event,
  eventProps,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string;
  eventProps?: Record<string, string>;
}) {
  return (
    <a
      {...props}
      onClick={(eventClick) => {
        props.onClick?.(eventClick);
        track(event, eventProps);
      }}
    >
      {children}
    </a>
  );
}
