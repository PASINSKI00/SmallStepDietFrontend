import { BaseDetails } from "../base/base-details";

export class RedirectDetails extends BaseDetails {
    url: string;
    continueOnly: boolean;

    constructor(message: string, url: string, continueOnly?: boolean){
        super(message);
        this.url = url;
        this.continueOnly = continueOnly ? continueOnly : false;
    }
}
