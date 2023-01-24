export class Post {
    idPost: number;
    userImageUrl: string;
    username: string;
    postDate: string;
    content: string;
    imageUrl: string;

    constructor(idPost: number, userImageUrl: string, username: string, postDate: string, content: string, imageUrl: string) {
        this.idPost = idPost;
        this.userImageUrl = userImageUrl;
        this.username = username;
        this.postDate = postDate;
        this.content = content;
        this.imageUrl = imageUrl;
    }
}
