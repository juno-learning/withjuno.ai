import { JunoLogo } from "@/components/juno-logo";

export function SiteFooter() {
  return (
    <footer className="px-8 lg:px-24 py-12 border-t border-border">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <JunoLogo />
        <div className="flex gap-8">
          <div>
            <h4 className="text-xs font-medium mb-1">Careers</h4>
            <a
              href="mailto:careers@withjuno.ai"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              careers@withjuno.ai
            </a>
          </div>
          <div>
            <h4 className="text-xs font-medium mb-1">Press</h4>
            <a
              href="mailto:media@withjuno.ai"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              media@withjuno.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
