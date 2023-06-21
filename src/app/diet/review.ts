export class Review {
    imageUrl: string;
    name: string;
    rating: number;
    content: string|undefined;

    constructor(imageUrl: string, name: string, rating: number, content?: string) {
        this.imageUrl = imageUrl;
        this.name = name;
        this.rating = rating;
        this.content = content;
    }
}
