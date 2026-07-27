import type { SVGProps } from "react";

export type IconName =
  | "bath"
  | "bolt"
  | "bowl"
  | "chevron"
  | "heart"
  | "logout"
  | "message"
  | "moon"
  | "paw"
  | "play"
  | "send"
  | "smile"
  | "sparkles";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export default function Icon({ name, ...props }: IconProps) {
  const paths: Record<IconName, React.ReactNode> = {
    bath: <><path d="M4 13h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z"/><path d="M7 13V7a3 3 0 0 1 6 0"/><path d="M10 7h6"/><path d="M17 4v.01M20 7v.01M17 10v.01"/></>,
    bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/>,
    bowl: <><path d="M4 11h16l-2 7H6l-2-7Z"/><path d="M8 8c1-2 2 0 4-2 2 2 3 0 4 2"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></>,
    message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>,
    paw: <><circle cx="7.5" cy="8" r="2"/><circle cx="16.5" cy="8" r="2"/><circle cx="5" cy="13" r="1.7"/><circle cx="19" cy="13" r="1.7"/><path d="M8.2 18.2c0-2.3 1.7-4.2 3.8-4.2s3.8 1.9 3.8 4.2c0 1.5-1.2 2.8-2.7 2.8h-2.2a2.8 2.8 0 0 1-2.7-2.8Z"/></>,
    play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></>,
    smile: <><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></>,
    sparkles: <><path d="m12 3 1.1 3.2L16 7.5l-2.9 1.3L12 12l-1.1-3.2L8 7.5l2.9-1.3L12 3Z"/><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14ZM19 12l.7 1.8 1.8.7-1.8.7L19 17l-.7-1.8-1.8-.7 1.8-.7L19 12Z"/></>,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
