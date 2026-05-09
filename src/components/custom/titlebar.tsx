import { getCurrentWindow } from "@tauri-apps/api/window";
import { Button } from "../ui/button";
import { MinusIcon, Maximize2Icon, XIcon } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Titlebar() {
  const onMinimize = () => {
    void getCurrentWindow().minimize();
  };

  const onToggleMaximize = () => {
    void (async () => {
      const win = getCurrentWindow();
      if (await win.isMaximized()) {
        await win.unmaximize();
      } else {
        await win.maximize();
      }
    })();
  };

  const onClose = () => {
    void getCurrentWindow().close();
  };

  return (
    <div className="titlebar">
      <div data-tauri-drag-region></div>
      {/* Add the app logo to the left corner of the titlebar */}
      <ThemeToggle className="absolute left-2 top-1 rounded-full max-h-8" />

      <div className="controls flex my-2 mr-2 items-center">
        <Button
          id="titlebar-minimize"
          title="minimize"
          variant="ghost"
          size="sm"
          className="my-2"
          onClick={onMinimize}
        >
          <MinusIcon className="size-4" />
        </Button>
        <Button
          id="titlebar-maximize"
          title="maximize"
          variant="ghost"
          size="sm"
          className="my-2"
          onClick={onToggleMaximize}
        >
          <Maximize2Icon className="size-4" />
        </Button>
        <Button
          id="titlebar-close"
          title="close"
          variant="ghost"
          size="sm"
          className="my-2"
          onClick={onClose}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
