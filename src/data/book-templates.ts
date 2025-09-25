export type BookTemplate = {
  id: string;
  variant: "solid" | "grid" | "abstract" | "strap" | "gradient";
  title: string;
  subtitle?: string;
  coverImage?: string;
};

export const neutralBookTemplates: BookTemplate[] = [
  {
    id: "frame-0",
    variant: "solid",
    title: "Morning Focus",
    subtitle: "Plan today’s wins",
    coverImage: "/Images/cover-images/Frame-0.png",
  },
  {
    id: "frame-1",
    variant: "grid",
    title: "Class Notes",
    subtitle: "Lecture cues & to-dos",
    coverImage: "/Images/cover-images/Frame-1.png",
  },
  {
    id: "frame-2",
    variant: "abstract",
    title: "Ideas & Mood",
    subtitle: "Color, doodles, inspo",
    coverImage: "/Images/cover-images/Frame-2.png",
  },
  {
    id: "frame-3",
    variant: "strap",
    title: "Project Log",
    subtitle: "Brain dumps + todos",
    coverImage: "/Images/cover-images/Frame-3.png",
  },
  {
    id: "frame-4",
    variant: "gradient",
    title: "Personal Journal",
    subtitle: "Moments worth saving",
    coverImage: "/Images/cover-images/Frame-4.png",
  },
  {
    id: "frame-5",
    variant: "solid",
    title: "Dream Archive",
    subtitle: "Sketch what you saw",
    coverImage: "/Images/cover-images/Frame-5.png",
  },
  {
    id: "frame-6",
    variant: "grid",
    title: "Study Blueprint",
    subtitle: "Map assignments + labs",
    coverImage: "/Images/cover-images/Frame-6.png",
  },
  {
    id: "frame-7",
    variant: "abstract",
    title: "Mood Collage",
    subtitle: "Textures, colors, feelings",
    coverImage: "/Images/cover-images/Frame-7.png",
  },
  {
    id: "frame-8",
    variant: "strap",
    title: "Habit Rings",
    subtitle: "Track daily loops",
    coverImage: "/Images/cover-images/Frame-8.png",
  },
  {
    id: "frame-9",
    variant: "gradient",
    title: "Self-Care Sync",
    subtitle: "Body, mind, spirit",
    coverImage: "/Images/cover-images/Frame-9.png",
  },
  {
    id: "frame-10",
    variant: "solid",
    title: "Content Planner",
    subtitle: "Posts, drafts, drops",
    coverImage: "/Images/cover-images/Frame-10.png",
  },
  {
    id: "frame-11",
    variant: "grid",
    title: "Budget Buddy",
    subtitle: "Saving + splurges",
    coverImage: "/Images/cover-images/Frame-11.png",
  },
  {
    id: "frame-12",
    variant: "abstract",
    title: "Travel Gems",
    subtitle: "Places + playlists",
    coverImage: "/Images/cover-images/Frame-12.png",
  },
  {
    id: "frame-13",
    variant: "strap",
    title: "Mind Dump",
    subtitle: "Unfiltered thoughts",
    coverImage: "/Images/cover-images/Frame-13.png",
  },
  {
    id: "frame-14",
    variant: "gradient",
    title: "Night Reflections",
    subtitle: "Last notes before sleep",
    coverImage: "/Images/cover-images/Frame-14.png",
  },
];

export function getTemplateById(id: string): BookTemplate | null {
  return neutralBookTemplates.find((template) => template.id === id) ?? null;
}
