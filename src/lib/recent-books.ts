export const DRAFTS_STORAGE_KEY = "keeps-drafts";
export const RECENT_BOOKS_STORAGE_KEY = "keeps-recents";
export const BOARD_STORAGE_PREFIX = "keeps-board-";
export const RECENT_BOOKS_LIMIT = 8;

export type RecentBook = {
  id: string;
  title: string;
  subtitle?: string;
  coverImage?: string | null;
  background: string;
  variant: "solid" | "grid" | "abstract" | "strap" | "gradient";
  titleColor?: string | null;
  subtitleColor?: string | null;
  sourceTemplateId?: string | null;
  updatedAt: number;
};

type DraftLike = RecentBook & Record<string, unknown>;

const allowedVariants: Set<RecentBook["variant"]> = new Set([
  "solid",
  "grid",
  "abstract",
  "strap",
  "gradient",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeRecentBook = (value: unknown): RecentBook | null => {
  if (!isRecord(value)) return null;

  const { id, title, background, variant } = value;
  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof background !== "string" ||
    typeof variant !== "string" ||
    !allowedVariants.has(variant as RecentBook["variant"])
  ) {
    return null;
  }

  const updatedAtRaw = value.updatedAt;
  const updatedAt =
    typeof updatedAtRaw === "number" && Number.isFinite(updatedAtRaw)
      ? updatedAtRaw
      : 0;

  const normalized: RecentBook = {
    id,
    title,
    background,
    variant: variant as RecentBook["variant"],
    updatedAt,
  };

  if (typeof value.subtitle === "string") {
    normalized.subtitle = value.subtitle;
  }

  if (typeof value.coverImage === "string") {
    normalized.coverImage = value.coverImage;
  } else if (value.coverImage === null) {
    normalized.coverImage = null;
  }

  if (typeof value.titleColor === "string") {
    normalized.titleColor = value.titleColor;
  } else if (value.titleColor === null) {
    normalized.titleColor = null;
  }

  if (typeof value.subtitleColor === "string") {
    normalized.subtitleColor = value.subtitleColor;
  } else if (value.subtitleColor === null) {
    normalized.subtitleColor = null;
  }

  if (typeof value.sourceTemplateId === "string") {
    normalized.sourceTemplateId = value.sourceTemplateId;
  } else if (value.sourceTemplateId === null) {
    normalized.sourceTemplateId = null;
  }

  return normalized;
};

export const readRecentBooks = (): RecentBook[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_BOOKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const recents = parsed
      .map(normalizeRecentBook)
      .filter((item): item is RecentBook => Boolean(item))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, RECENT_BOOKS_LIMIT);
    return recents;
  } catch (error) {
    console.error("Failed to read recent books", error);
    return [];
  }
};

const writeRecentBooks = (books: RecentBook[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      RECENT_BOOKS_STORAGE_KEY,
      JSON.stringify(books)
    );
  } catch (error) {
    console.error("Failed to write recent books", error);
  }
};

type SyncResult<T extends DraftLike> = {
  drafts: Record<string, T>;
  recents: RecentBook[];
  removedIds: string[];
};

export const syncDraftsAndRecents = <T extends DraftLike>(
  drafts: Record<string, T>
): SyncResult<T> => {
  if (typeof window === "undefined") {
    return { drafts, recents: [], removedIds: [] };
  }

  const entries = Object.entries(drafts)
    .map(([id, value]) => {
      const normalized = normalizeRecentBook({ ...value, id });
      const updatedAt =
        (typeof value.updatedAt === "number" && Number.isFinite(value.updatedAt)
          ? value.updatedAt
          : normalized?.updatedAt) ?? 0;
      const raw = value as Record<string, unknown>;
      const variantValue =
        typeof raw.variant === "string" &&
        allowedVariants.has(raw.variant as RecentBook["variant"])
          ? (raw.variant as RecentBook["variant"])
          : "solid";

      const fallback: RecentBook = {
        id,
        title:
          typeof raw.title === "string" ? (raw.title as string) : "Untitled Book",
        background:
          typeof raw.background === "string" ? (raw.background as string) : "",
        variant: variantValue,
        updatedAt,
      };

      if (typeof raw.subtitle === "string") {
        fallback.subtitle = raw.subtitle as string;
      }
      if (typeof raw.coverImage === "string") {
        fallback.coverImage = raw.coverImage as string;
      } else if (raw.coverImage === null) {
        fallback.coverImage = null;
      }
      if (typeof raw.titleColor === "string") {
        fallback.titleColor = raw.titleColor as string;
      } else if (raw.titleColor === null) {
        fallback.titleColor = null;
      }
      if (typeof raw.subtitleColor === "string") {
        fallback.subtitleColor = raw.subtitleColor as string;
      } else if (raw.subtitleColor === null) {
        fallback.subtitleColor = null;
      }
      if (typeof raw.sourceTemplateId === "string") {
        fallback.sourceTemplateId = raw.sourceTemplateId as string;
      } else if (raw.sourceTemplateId === null) {
        fallback.sourceTemplateId = null;
      }

      const normalizedBook = normalized ?? fallback;

      return {
        id,
        value: {
          ...value,
          id,
          updatedAt,
          coverImage:
            typeof normalizedBook.coverImage === "string"
              ? normalizedBook.coverImage
              : normalizedBook.coverImage ?? null,
          background: normalizedBook.background,
          title: normalizedBook.title,
          subtitle: normalizedBook.subtitle ?? undefined,
          titleColor:
            typeof normalizedBook.titleColor === "string"
              ? normalizedBook.titleColor
              : normalizedBook.titleColor === null
              ? null
              : undefined,
          subtitleColor:
            typeof normalizedBook.subtitleColor === "string"
              ? normalizedBook.subtitleColor
              : normalizedBook.subtitleColor === null
              ? null
              : undefined,
          sourceTemplateId:
            typeof normalizedBook.sourceTemplateId === "string"
              ? normalizedBook.sourceTemplateId
              : normalizedBook.sourceTemplateId === null
              ? null
              : undefined,
        } as T,
        normalized: normalizedBook,
        updatedAt,
      };
    })
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const limited = entries.slice(0, RECENT_BOOKS_LIMIT);
  const keepIds = new Set(limited.map((entry) => entry.id));
  const removedIds = entries
    .slice(RECENT_BOOKS_LIMIT)
    .map((entry) => entry.id);

  const nextDrafts: Record<string, T> = {};
  for (const entry of limited) {
    nextDrafts[entry.id] = entry.value;
  }

  const recents = limited
    .map((entry) => entry.normalized)
    .filter((item): item is RecentBook => Boolean(item));

  try {
    window.localStorage.setItem(
      DRAFTS_STORAGE_KEY,
      JSON.stringify(nextDrafts)
    );
  } catch (error) {
    console.error("Failed to persist drafts", error);
  }

  writeRecentBooks(recents);

  removedIds.forEach((id) => {
    try {
      window.localStorage.removeItem(`${BOARD_STORAGE_PREFIX}${id}`);
    } catch {
      /* ignore storage removal errors */
    }
  });

  console.debug("[RecentBooks] Synced drafts and recents", {
    kept: recents.map((book) => book.id),
    removedIds,
  });

  return { drafts: nextDrafts, recents, removedIds };
};

export const upsertRecentBook = (book: RecentBook) => {
  const current = readRecentBooks();
  const next = [
    { ...book, updatedAt: Date.now() },
    ...current.filter((item) => item.id !== book.id),
  ].slice(0, RECENT_BOOKS_LIMIT);
  writeRecentBooks(next);
  return next;
};
