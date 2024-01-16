export interface Article {
    id: string;
    title: string;
    content: string;
    author: string; // NOTE: use address? sounds like a bit of pain in the future, might need user info in here. Plain address will have to do for now with domain resolve in the future
}