export interface Article {
    title: string;
    content: string;
    publishDate: Date;
    preview: string;
    author: {
        name: string;
        avatar: string;
        address: string;
    }
}