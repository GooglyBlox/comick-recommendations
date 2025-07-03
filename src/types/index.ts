export interface Follow {
  created_at: string;
  read_at: string;
  type: number;
  score: number | null;
  chapter_id: number;
  last_chapter_id: number;
  md_chapters: {
    hid: string;
    chap: string;
    lang: string;
    vol: string | null;
  };
  md_comics: {
    id: number;
    title: string;
    slug: string;
    bayesian_rating: string | null;
    status: number;
    rating_count: number;
    follow_count: number;
    last_chapter: number;
    uploaded_at: string;
    demographic: number | null;
    country: string;
    genres: number[];
    is_english_title: boolean | null;
    md_titles: Array<{
      title: string;
      lang: string;
    }>;
    translation_completed: boolean;
    year: number;
    md_covers: Array<{
      w: number;
      h: number;
      b2key: string;
    }>;
  };
}

export interface Recommendation {
  up: number;
  down: number;
  total: number;
  relates: {
    title: string;
    slug: string;
    hid: string;
    md_covers: Array<{
      vol: string | null;
      w: number;
      h: number;
      b2key: string;
    }>;
  };
}

export interface ComicDetail {
  comic: {
    id: number;
    title: string;
    slug: string;
    recommendations: Recommendation[];
    md_covers: Array<{
      vol: string | null;
      w: number;
      h: number;
      b2key: string;
    }>;
  };
}

export interface ProcessedRecommendation {
  title: string;
  slug: string;
  hid: string;
  count: number;
  coverUrl: string;
}
