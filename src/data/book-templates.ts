export type BookTemplate = {
  id: string;
  variant: "solid" | "grid" | "abstract" | "strap" | "gradient";
  title: string;
  subtitle?: string;
};

export const neutralBookTemplates: BookTemplate[] = [
  {
    id: "solid",
    variant: "solid",
    title: "Morning Focus",
    subtitle: "Plan today’s wins",
  },
  {
    id: "grid",
    variant: "grid",
    title: "Class Notes",
    subtitle: "Lecture cues & to-dos",
  },
  {
    id: "abstract",
    variant: "abstract",
    title: "Ideas & Mood",
    subtitle: "Color, doodles, inspo",
  },
  {
    id: "strap",
    variant: "strap",
    title: "Project Log",
    subtitle: "Brain dumps + todos",
  },
  {
    id: "gradient",
    variant: "gradient",
    title: "Personal Journal",
    subtitle: "Moments worth saving",
  },
];

export function getTemplateById(id: string): BookTemplate | null {
  return neutralBookTemplates.find((template) => template.id === id) ?? null;
}
