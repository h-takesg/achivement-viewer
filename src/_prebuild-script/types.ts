export type ArticleCategory =
    | "transaction"
    | "domestic-conference"
    | "international-conference"
    | "award"
    | "workshop";

export type ArticleMetaInfo = {
    title: string;
    category: ArticleCategory;
    book: string;
    author_ja: string[];
    author_en: string[];
    volume: string;
    number: string;
    pages: string;
    year: number;
    month: number;
    url: string;
    abstract: string;
}

export type Article = {
    id: string;
    meta: ArticleMetaInfo;
    hasFile: boolean;
}
