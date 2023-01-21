export class FinalIngredient {
    idFinalIngredient: number;
    name: string;
    weight: number;

    remove: boolean = false;
    modified: boolean = false;

    constructor(id: number, name: string, weight: number) {
        this.idFinalIngredient = id;
        this.name = name;
        this.weight = weight;
    }
}
