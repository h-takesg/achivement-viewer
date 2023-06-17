import { Article } from "@/_prebuild-script/types"

type Props = {
    article: Article;
}

function ArticleCard({article}: Props) {
    return (
        <div>
            <h1>{article.meta.title}</h1>
            <p>{article.meta.author_ja}</p>
        </div>
    )
}

export {ArticleCard};
