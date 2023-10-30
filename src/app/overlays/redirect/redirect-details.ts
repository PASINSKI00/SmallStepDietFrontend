import { BaseDetails } from "../base/base-details";

export class RedirectDetails extends BaseDetails {
    url: string;

    constructor(message: string, url: string){
        super(message);
        this.url = url;
    }
}
