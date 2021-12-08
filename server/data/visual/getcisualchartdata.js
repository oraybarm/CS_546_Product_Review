const mongoCollections = require("../../config/mongoCollection");
const products = mongoCollections.products;

function getEleNums(data) {
    let map = {};
    for (i = 0; i < data.length; i++) {
        let key = data[i];
        if (map[key]) {
            map[key] += 1;
        } else {
            map[key] = 1;
        }
    }
    return map;
}

const exportedMethods = {

    async getVisualData(){
        const productCollection = await products();
        const taglist = await productCollection.find( {},
        { projection: { tags:1}}).toArray();
        let tag=[];
        for(let i=0;i<taglist.length;i++){
            for(let j=0;j<taglist[i].tags.length;j++){
                    tag.push(taglist[i].tags[j]);
            }
        }
        let data=getEleNums(tag);
        return data;
    }
};
  
module.exports = exportedMethods;


 