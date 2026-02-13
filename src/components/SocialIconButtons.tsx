import { Github, Linkedin, Mail } from "lucide-react";

type SocialIconButtonsProps = {
  className?: string;
};

const defaultHref = "#";

export function SocialIconButtons({ className = "" }: SocialIconButtonsProps) {
  const base =
    "inline-flex items-center justify-center size-10 rounded-full text-white transition-colors hover:text-accent focus:text-accent active:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <a
        href="https://github.com/guillermo-rebolledo"
        aria-label="GitHub"
        className={base}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github className="size-5" strokeWidth={2} />
      </a>
      <a
        href="https://www.linkedin.com/in/gortizdev/"
        aria-label="LinkedIn"
        className={base}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Linkedin className="size-5" strokeWidth={2} />
      </a>
      <a
        href="mailto:gortiz.dev@gmail.com"
        aria-label="Email"
        className={base}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Mail className="size-5" strokeWidth={2} />
      </a>
    </div>
  );
}
