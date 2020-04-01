const clipboardy = require("clipboardy");
const fs = require("fs");
const path = require("path");
const reg = /\!\[[\s\S]*?\]\([\s\S]*?\)/g;
const Picgo = require("picgo");
const picgo = new Picgo();
const download = require("image-downloader");
const _ = require("lodash");
const imageDir = "images/";
if (!fs.existsSync(imageDir)){
    fs.mkdirSync(imageDir);
}
const text = clipboardy.readSync();
const urlReg = /(?<=\().+?(?=\))/;
const matchResult = text.match(reg);
if(!matchResult){
    throw '剪贴板不包含markdown图片';
}
const dict = Promise.all(
  matchResult.map((item, index) => {
    const url = item.match(urlReg)[0];
    const name = url.match(/[^/]+$/)[0];
    return download.image({
      url,
      dest: imageDir + index + "-" + Date.now() + "-" + name
    });
  })
);

dict
  .then(res => {
    const allPaths = [];
    res.forEach(({ filename, image }, index) => {
      allPaths.push({ path: filename, str: matchResult[index] });
    });
    return allPaths;
  })
  .then(allPaths => {
    const paths = allPaths.map(item => item.path);
    picgo.upload(paths);
  });
picgo.on("finished", ctx => {
  const resultList = ctx.output; // [{fileName, width, height, extname, imgUrl}] <- 注意有imgUrl了。
  const resultListSorted = resultList.sort((item1, item2) => {
    const index1 = parseInt(item1.fileName.split("-")[0]);
    const index2 = parseInt(item2.fileName.split("-")[0]);
    return index1 - index2;
  });
  const newImageLinks = matchResult.map((item, index) => {
    return item.replace(urlReg, resultListSorted[index].imgUrl);
  });
  const removeImage = _.split(text, reg);
  const mixedArr = _.flatten(_.zip(removeImage, newImageLinks));
  mixedArr.pop();
  const newText = mixedArr.join("");
  clipboardy.writeSync(newText);
  removeAllImages(imageDir);
  console.log("the markdown text has been written to the clipboard");
});
picgo.on("failed", error => {
  console.log(error); // 错误信息
});

function removeAllImages(imageDir) {
  fs.readdir(imageDir, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(imageDir, file), err => {
        if (err) throw err;
      });
    }
  });
}
