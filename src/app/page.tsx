import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { Article, ArticleMetaInfo } from '@/_prebuild-script/types';
import { load } from 'js-yaml';
import { ArticleCard } from './ArticleCard';

const ARTICLES_DIR = resolve("articles");

export default function Home() {
  function getData(id: string): Article {
    const metaInfoPath = join(ARTICLES_DIR, id, "meta.yaml");
    const meta = load(readFileSync(metaInfoPath, "utf8")) as ArticleMetaInfo;
    const attachFilePath = join(ARTICLES_DIR, id, "paper.pdf");
    const hasFile = existsSync(attachFilePath);
    return {id, meta, hasFile};
  }
  
  const ids = readdirSync(ARTICLES_DIR, {withFileTypes: true}).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
  const articles = ids.map(id => getData(id));

  return (
    <main>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
        />
      ))}
    </main>
  )
}
