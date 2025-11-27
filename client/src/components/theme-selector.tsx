import { useTheme, type ThemeColor } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes: { color: ThemeColor; label: string; bgClass: string }[] = [
  { color: "green", label: "Forest Green", bgClass: "bg-emerald-500" },
  { color: "purple", label: "Royal Purple", bgClass: "bg-purple-500" },
  { color: "red", label: "Safari Red", bgClass: "bg-red-500" },
  { color: "blue", label: "Ocean Blue", bgClass: "bg-blue-500" },
  { color: "orange", label: "Sunset Orange", bgClass: "bg-orange-500" },
];

export function ThemeSelector() {
  const { themeColor, setThemeColor } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          aria-label="Choose color theme"
          data-testid="button-theme-selector"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.color}
            onClick={() => setThemeColor(theme.color)}
            className="flex items-center gap-3 cursor-pointer"
            data-testid={`theme-option-${theme.color}`}
          >
            <div className={`w-5 h-5 rounded-full ${theme.bgClass} flex items-center justify-center`}>
              {themeColor === theme.color && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            <span>{theme.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
