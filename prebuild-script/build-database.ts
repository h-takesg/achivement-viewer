import { load } from "js-yaml";
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync } from "fs";
import { Article, ArticleMetaInfo } from "./types";
import { basename, dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import DB, {Database} from "better-sqlite3";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = resolve(SCRIPT_DIR, "../articles");
const BUILD_DIR = resolve(SCRIPT_DIR, "../build");
const DATABASE_FILENAME = "achivement.sqlite3";
const DATABASE_FILEPATH = join(BUILD_DIR, DATABASE_FILENAME);
const METAINFO_FILENAME = "meta.yaml";
const ATTACH_FILENAME = "paper.pdf";
const CREATE_ACHIVEMENT_TABLE = "CREATE TABLE achivement(id text primary key, title text, category text, book text, author_ja text, author_en text, volume number, number number, pages text, year number, month number, url text, abstract text, has_file boolean);"

const loadAllArticles = (articlesDir: string): Article[] => {
    const dirList = readdirSync(articlesDir, {withFileTypes: true}).filter(dirent => dirent.isDirectory()).map(dirent => resolve(articlesDir, dirent.name));
    return dirList.map(dir => loadArticle(dir));
}

const loadArticle = (articleDir: string): Article => {
    const metaFilePath = join(articleDir, METAINFO_FILENAME);
    const attachFilePath = join(articleDir, ATTACH_FILENAME);
    
    const id = basename(articleDir);
    const meta = load(readFileSync(metaFilePath, "utf8")) as ArticleMetaInfo;
    const hasFile = existsSync(attachFilePath);
    
    return {id, meta, hasFile};
}

const buildDatabase = (articles: Article[]) => {
    if (existsSync(DATABASE_FILEPATH)) {
        unlinkSync(DATABASE_FILEPATH);
    }
    if (!existsSync(BUILD_DIR)) {
        mkdirSync(BUILD_DIR);
    }
    const db = new DB(DATABASE_FILEPATH);
    db.pragma('journal_mode = WAL');  // performanceのため要るらしい
    db.prepare(CREATE_ACHIVEMENT_TABLE).run();

    insertArticles(articles, db);
    console.log(db.prepare("SELECT * FROM achivement;").get());
}

const insertArticles = (articles: Article[], db: Database) => {
    articles.forEach(article => insertArticle(article, db));
}

const insertArticle = (article: Article, db: Database) => {
    const {id, meta, hasFile} = article;
    const {
        title,
        category,
        book,
        author_ja,
        author_en,
        volume,
        number,
        pages,
        year,
        month,
        url,
        abstract
    } = meta;
    const serialAuthorJa = author_ja.join(",");
    const serialAuthorEn = author_en.join(",");
    
    db.prepare(`INSERT INTO achivement VALUES('${id}', '${title}', '${category}', '${book}', '${serialAuthorJa}', '${serialAuthorEn}', ${volume}, ${number}, '${pages}', ${year}, ${month}, '${url}', '${abstract}', ${hasFile})`).run();
}

console.log("start build-database.ts");
const articles = loadAllArticles(ARTICLES_DIR);
console.log(articles);

buildDatabase(articles);
