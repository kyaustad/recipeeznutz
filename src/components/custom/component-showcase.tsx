import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  BoldIcon,
  ChevronDownIcon,
  InfoIcon,
  MoonIcon,
  SparklesIcon,
  SunIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";

export default function ComponentShowcase() {
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [greetLoading, setGreetLoading] = useState(false);
  const [recipeName, setRecipeName] = useState("Citrus olive cake");
  const [notes, setNotes] = useState(
    "Toast nuts until fragrant, then fold gently into the batter.",
  );
  const [course, setCourse] = useState("mains");
  const [tips, setTips] = useState(true);
  const [glassMode, setGlassMode] = useState(false);
  const [strength, setStrength] = useState([62]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  async function greet() {
    setGreetLoading(true);
    try {
      setGreetMsg(await invoke<string>("greet", { name: name || "chef" }));
    } finally {
      setGreetLoading(false);
    }
  }

  return (
    <div className="min-h-dvh pb-16 overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Design</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Liquid glass</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setDarkMode((d) => !d)}
                  aria-label={darkMode ? "Use light theme" : "Use dark theme"}
                >
                  {darkMode ? (
                    <SunIcon className="size-4" />
                  ) : (
                    <MoonIcon className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {darkMode ? "Light theme" : "Dark theme"}
              </TooltipContent>
            </Tooltip>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              ShadCN
            </Badge>
            <Badge variant="outline">Tauri</Badge>
          </div>
        </header>

        <Card>
          <CardHeader className="gap-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <SparklesIcon className="size-6 shrink-0 opacity-80" />
                  Recipeeznutz
                </CardTitle>
                <CardDescription>
                  ShadCN components on a mesh gradient with translucent
                  surfaces, backdrop blur, and specular highlights.
                </CardDescription>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Avatar>
                  <AvatarFallback className="text-xs font-medium">
                    RZ
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-wrap gap-1.5">
                  <Badge>UI lab</Badge>
                  <Badge variant="secondary">Vite</Badge>
                  <Badge variant="outline">Radix</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert>
              <InfoIcon />
              <AlertTitle>Liquid glass surfaces</AlertTitle>
              <AlertDescription>
                Cards, menus, dialogs, and inputs pick up blur and soft
                gradients from{" "}
                <code className="rounded bg-muted/80 px-1">App.css</code> theme
                tokens—scroll the page to see the mesh move behind glass panels.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Toggle aria-label="Toggle bold" size="sm" variant="outline">
            <BoldIcon />
          </Toggle>
        </div>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="editor">Recipe editor</TabsTrigger>
            <TabsTrigger value="shell">Tauri shell</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="mt-4 space-y-6 outline-none">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Form controls</CardTitle>
                  <CardDescription>
                    Inputs and picks that sit on the glass stack.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipe-title">Title</Label>
                    <Input
                      id="recipe-title"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                      placeholder="Recipe title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipe-notes">Notes</Label>
                    <Textarea
                      id="recipe-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      placeholder="Steps, temperatures, substitutions…"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Course</Label>
                    <Select value={course} onValueChange={setCourse}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starters">Starters</SelectItem>
                        <SelectItem value="mains">Mains</SelectItem>
                        <SelectItem value="desserts">Desserts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="tips"
                        checked={tips}
                        onCheckedChange={(v) => setTips(v === true)}
                      />
                      <Label htmlFor="tips" className="font-normal">
                        Weekly tips email
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="glass"
                        checked={glassMode}
                        onCheckedChange={setGlassMode}
                      />
                      <Label htmlFor="glass" className="font-normal">
                        Extra glass sheen
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Backdrop strength</span>
                      <span>{strength[0]}%</span>
                    </div>
                    <Slider
                      value={strength}
                      onValueChange={setStrength}
                      max={100}
                      step={1}
                    />
                    <Progress value={strength[0]} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Floating UI</CardTitle>
                  <CardDescription>
                    Popovers, menus, and dialogs use the same glass treatment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        Popover
                        <ChevronDownIcon className="size-4 opacity-60" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72">
                      <div className="space-y-1">
                        <p className="font-medium">Ingredient spotlight</p>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Popover content blurs the mesh behind it so color from
                          the page bleeds through like thick glass.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        Menu
                        <ChevronDownIcon className="size-4 opacity-60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
                      <DropdownMenuLabel>Recipe</DropdownMenuLabel>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Share link</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="secondary">Hover card</Button>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <p className="text-sm leading-snug">
                        Hover surfaces use the same translucent panel styling as
                        popovers—ideal for lightweight previews.
                      </p>
                    </HoverCardContent>
                  </HoverCard>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Dialog</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Save to library?</DialogTitle>
                        <DialogDescription>
                          This dialog uses the popover surface token so it
                          matches menus and sheets in the liquid glass system.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2 sm:justify-end">
                        <Button type="button" variant="outline">
                          Not now
                        </Button>
                        <Button type="button">Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="shell" className="mt-4 outline-none">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tauri bridge</CardTitle>
                <CardDescription>
                  Call into Rust and show the response below the form.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="flex max-w-md flex-col gap-3 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void greet();
                  }}
                >
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="off"
                  />
                  <Button
                    type="submit"
                    disabled={greetLoading}
                    className="sm:w-32"
                  >
                    {greetLoading ? <Spinner className="size-4" /> : "Greet"}
                  </Button>
                </form>
                {greetMsg ? (
                  <p className="text-muted-foreground mt-3 text-sm">
                    {greetMsg}
                  </p>
                ) : null}
              </CardContent>
              <CardFooter className="text-muted-foreground text-xs">
                Command is defined in the Tauri Rust crate as{" "}
                <code className="rounded bg-muted/80 px-1">greet</code>.
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
