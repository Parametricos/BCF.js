import {BcfReader} from "../src";
import * as fs from "fs/promises";

const test = async () => {
    const file = await fs.readFile("../test-data/MaximumInformation.bcf");
    const reader = new BcfReader();
    await reader.read(file);


    reader.topics.forEach((topic) => {
        if(topic.viewpoints.length > 0){
            console.log(topic.viewpoints[0].perspective_camera)

            const v = topic?.markup?.viewpoints;

            if(!v) return;

            topic.getViewpointSnapshot(v[0]).then((data) => {
                console.log(data);
            })
        }

    })
}

test()