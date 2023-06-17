import { existsSync, readFileSync, readdirSync } from "fs";
import { join, resolve } from "path";
import { load } from "js-yaml";
import { Article, ArticleMetaInfo } from "@/_prebuild-script/types";

// 事前生成されていない記事IDは404にする
export const dynamicParams = false;

const ARTICLES_DIR = resolve("articles");

export function generateStaticParams() {
    const ids = readdirSync(ARTICLES_DIR, {withFileTypes: true}).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    return ids.map(id => ({id}));
}


export default function Page({ params }: { params: { id: string } }) {
    const article = getData(params.id);

    function getData(id: string): Article {
        const metaInfoPath = join(ARTICLES_DIR, id, "meta.yaml");
        const meta = load(readFileSync(metaInfoPath, "utf8")) as ArticleMetaInfo;
        const attachFilePath = join(ARTICLES_DIR, id, "paper.pdf");
        const hasFile = existsSync(attachFilePath);
        return {id, meta, hasFile};
    }

    return (
        <>
        <h1>My Page for {params.id}</h1>
        {article.meta.title}
        {article.meta.category}
        {article.meta.book}
        {article.meta.author_ja}
        {article.meta.author_en}
        {article.meta.volume}
        {article.meta.number}
        {article.meta.pages}
        {article.meta.year}
        {article.meta.month}
        {article.meta.url}
        {article.meta.abstract}
        </>
    );
}
