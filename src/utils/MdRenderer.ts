import fs from "fs-extra";
import hljs from "highlight.js";
import MarkdownIt from "markdown-it";

const markdown = MarkdownIt({
  html: true,
  highlight: function (str:string, lang:any) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
});

export const mdRenderer = (file_path: string)=>{

  return new Promise(async (resolve)=>{

    // markdown source
    const content = await fs.readFile(file_path, "utf8");

    // converted to HTML
    const rendered = await markdown.render(content);

      const htmlFile = `<!DOCTYPE html>

      <html lang="en">

      <head>

        <meta charset="UTF-8" />

        <title>Markdown Document</title>


        <link rel="stylesheet" href="./statics/md_bundle/default.css">

        <link rel="stylesheet" href="./statics/md_bundle/highlight.js.css">

        <link rel="stylesheet" type="text/css" href="./statics/md_bundle/github.css" id="_theme">
        
        <link rel="stylesheet" type="text/css" href="./statics/md_bundle/prism.min.css" id="_prism">
        
        <link rel="stylesheet" href="./statics/md_bundle/fonts.css">

        <link rel="stylesheet" href="./statics/md_bundle/bootstrap.min.css">

        <script src="./statics/md_bundle/jquery-3.2.1.slim.min.js"></script>
        
        <script src="./statics/md_bundle/popper.min.js"></script>

        <script src="./statics/md_bundle/bootstrap.min.js"></script>
  

      </head>

      <body class="_theme-github">
      
        <div id="_html" class="markdown-body _width-undefined md_main_div">
          
          ${rendered}

        </div>

      </body>

      </html>`;

      resolve(htmlFile);

      // await fs.mkdirs("./public");

      // await fs.writeFile("./public/index.html", htmlFile, "utf8");

      // // await fs.copy(
      // //   "./node_modules/highlight.js/styles/default.css",
      // //   "./public/default.css",
      // //   { overwrite: true }
      // // );
  });
}