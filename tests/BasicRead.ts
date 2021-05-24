import {BcfReader} from "../src";
import * as fs from "fs/promises";

const test = async () => {
    const file = await fs.readFile("../test-data/MaximumInformation.bcf");
    const reader = new BcfReader();
    await reader.read(file);

    reader.topics.forEach((topic) => {
        console.log(topic.markup?.topic.title)
    })
}

test()