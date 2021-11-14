import {Injectable} from "@nestjs/common";
import {Item} from "./models";

@Injectable()
export class ItemsService {

    private readonly items: Item[] = [];

    constructor() {
        this.items = [
            {id: "I001", name: "Item 1"},
            {id: "I002", name: "Item 2"},
            {id: "I003", name: "Item 3"},
        ];
    }

    findItems(): Item[] {

        return this.items;

    }
}