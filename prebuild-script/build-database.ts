import { load } from "js-yaml";
import { existsSync, readFileSync, readdirSync } from "fs";
import { Article, ArticleMetaInfo } from "./types";
import { basename, dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = resolve(SCRIPT_DIR, "../articles");

const loadAllArticles = (articlesDir: string): Article[] => {
    const dirList = readdirSync(articlesDir, {withFileTypes: true}).filter(dirent => dirent.isDirectory()).map(dirent => resolve(articlesDir, dirent.name));
    return dirList.map(dir => loadArticle(dir));
}

const loadArticle = (articleDir: string): Article => {
    const metaFilePath = join(articleDir, "meta.yaml");
    const paperFilePath = join(articleDir, "paper.pdf");
    
    const id = basename(articleDir);
    const meta = load(readFileSync(metaFilePath, "utf8")) as ArticleMetaInfo;
    const hasFile = existsSync(paperFilePath);
    
    return {id, meta, hasFile};
}

console.log("start build-database.ts");
console.log(loadAllArticles(ARTICLES_DIR));
