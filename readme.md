# Markdown 图床转换器
此脚本用于将markdown 里面到图片统一转移到新图床上  
配合[picgo](https://picgo.github.io/PicGo-Core-Doc/zh/)上传图片到新图床

### 1. 安装 picgo

`npm install picgo -g` 全局安装

### 2. 配置 picgo

- [找到 picgo 配置文件](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html),
  Mac\$Linux `~/.picgo/config.json`, windows `C:\Users\你的用户名、.picgo\config.json`
- [添加图床](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html#picbed)，模版为
```
{
  "picBed": {
    "current": "github",
    "uploader": "github",
    "transformer": "path",
    "github": {
        "repo": "", // 仓库名，格式是 username/reponame
        "token": "", // github token
        "path": "", // 自定义存储路径，比如 img/
        "customUrl": "", // 自定义域名，注意要加 http://或者 https://
        "branch": "" // 分支名，默认是 master
    }
  },
  "picgoPlugins": {}
}
```
你也可以`picgo set uploader`来一步步配置图床
- 复制markdown语段到剪切板
- 运行脚本`node index.js`
- 成功之后，转换图床之后到markdown会写入到你到剪切板，直接粘贴即可
