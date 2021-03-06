(function(options) {
  class Parser {
    constructor() {
      this.haveData = false;
      this.categories = {};
      if (/login-form/.test(options.responseText)) {
        options.status = ESearchResultParseStatus.needLogin;
        return;
      }
      options.isLogged = true;
      this.haveData = true;
    }

    /**
     * 获取搜索结果
     */

    getResult() {
      if (!this.haveData) {
        return [];
      }
      let site = options.site;
      if (!options.page.numFound) {
        return [];
      }
      let torrentList = options.page.torrentList;
      let results = [];

      try {
        torrentList.forEach(item => {
          if (item.hasOwnProperty("fid")) {
            let data = {
              title: item.name,
              link: `${site.url}torrent/${item.fid}`,
              url: `${site.url}download/${item.fid}/${item.filename}`,
              size: parseFloat(item.size),
              time: item.addedTimestamp,
              author: "",
              seeders: item.seeders,
              leechers: item.leechers,
              completed: item.completed,
              comments: item.numComments,
              site: site,
              tags: [],
              entryName: options.entry.name,
              category: options.searcher.getCategoryById(
                site,
                options.url,
                item.categoryID
              )
            };
            results.push(data);
          }
        });
        console.log("results.length", results.length);
        if (results.length == 0) {
          options.status = ESearchResultParseStatus.noTorrents;
        }
      } catch (error) {
        console.log(error);
        options.status = ESearchResultParseStatus.parseError;
        options.errorMsg = error.stack;
      }
      return results;
    }
  }

  let parser = new Parser(options);
  options.results = parser.getResult();
  console.log(options.results);
})(options);
