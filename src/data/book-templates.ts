export type BookTemplate = {
  id: string;
  variant: "solid" | "grid" | "abstract" | "strap" | "gradient";
  title: string;
  subtitle?: string;
  coverImage?: string;
};

type CoverImageContext = {
  keys(): string[];
};

declare const require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ): CoverImageContext;
};

const coverImageContext = require.context(
  "../../public/Images/cover-images",
  false,
  /\.(png|jpe?g|webp)$/
);

const coverImagePaths: string[] = coverImageContext
  .keys()
  .sort((a: string, b: string) => a.localeCompare(b, undefined, { numeric: true }))
  .map((path: string) => `/Images/cover-images/${path.replace("./", "")}`);

const templateBlueprints: Array<Pick<BookTemplate, "variant" | "title" | "subtitle">> = [
  { variant: "solid", title: "", subtitle: "" },
  { variant: "grid", title: "Class Notes", subtitle: "Lecture cues & to-dos" },
  { variant: "abstract", title: "", subtitle: "" },
  { variant: "strap", title: "", subtitle: "" },
  { variant: "gradient", title: "", subtitle: "" },
  { variant: "solid", title: "", subtitle: "" },
  { variant: "grid", title: "", subtitle: "" },
  { variant: "abstract", title: "Mood Collage", subtitle: "Textures, colors, feelings" },
  { variant: "strap", title: "Habit Rings", subtitle: "Track daily loops" },
  { variant: "gradient", title: "Self-Care Sync", subtitle: "Body, mind, spirit" },
  { variant: "solid", title: "Content Planner", subtitle: "Posts, drafts, drops" },
  { variant: "grid", title: "Budget Buddy", subtitle: "Saving + splurges" },
  { variant: "abstract", title: "Travel Gems", subtitle: "Places + playlists" },
  { variant: "strap", title: "Mind Dump", subtitle: "Unfiltered thoughts" },
  { variant: "gradient", title: "Night Reflections", subtitle: "Last notes before sleep" },
  { variant: "solid", title: "Creative Sparks", subtitle: "Doodles & ideas" },
  { variant: "grid", title: "Team Huddle", subtitle: "Collab notes & wins" },
];

export const neutralBookTemplates: BookTemplate[] = coverImagePaths.map((coverImage: string, index: number) => ({
  id: `cover-${index}`,
  coverImage,
  ...templateBlueprints[index % templateBlueprints.length],
}));

export function getTemplateById(id: string): BookTemplate | null {
  return neutralBookTemplates.find((template) => template.id === id) ?? null;
}
