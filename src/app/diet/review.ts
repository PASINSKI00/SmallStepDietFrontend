export class Review {
    image: string;
    name: string;
    rating: number;
    content: string|undefined;

    constructor(image: string, name: string, rating: number, content?: string) {
        this.image = image;
        this.name = name;
        this.rating = rating;
        this.content = content;
    }
}
