export type Project = {
  id: "wlg" | "mosaic" | "lifescale" | "signalspace";
  name: string;
  started: string;
  where: string;
  role: string;
  short: string;
  mild: string;
  recipe: string;
  pot: string;
  burnt: string;
  plated: string;
  stack: string[];
};

export type Job = { role: string; place: string; when: string };

export type Link = { label: string; href: string };
export type Image = { src: string; alt: string };
export type ProjectMedia = Image & { links: Link[]; extra: Image[] };

export type LifeItem = Image & { id: string; title: string; line: string };
export type Cooking = { title: string; body: string[]; photos: [Image, Image] };
export type GalleryItem = Image & { caption: string };

export type ToolGroup = { group: string; items: string[] };
export type Involvement = { name: string; note: string; when: string };
