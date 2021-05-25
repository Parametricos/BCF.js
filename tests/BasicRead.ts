import {BcfReader} from "../src";
import * as fs from "fs/promises";

const test = async () => {
    const file = await fs.readFile("../test-data/MaximumInformation.bcf");
    const reader = new BcfReader();
    await reader.read(file);

    reader.topics.forEach((topic) => {
        if(topic.viewpoints.length > 0){
            console.log(topic.viewpoints[0].perspective_camera)
        }
    })
}

test()