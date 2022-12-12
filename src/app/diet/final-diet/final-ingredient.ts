export class FinalIngredient {
    idFinalIngredient: number;
    name: string;
    weight: number;

    constructor(id: number, name: string, weight: number) {
        this.idFinalIngredient = id;
        this.name = name;
        this.weight = weight;
    }
}
