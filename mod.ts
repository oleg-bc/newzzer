
#!/usr/bin/env -S deno --allow-net --allow-read --allow-write --allow-env
// ***************
// IMPORTS
// ***************
import {
    parse,
    green,
    bold,
    Args,
    existsSync,
    writeJsonSync,
    readJsonSync,
    magenta,
    cyan,
  } from "./deps.ts";
  import { displayHelpAndQuit } from "./error.ts";
  import { IArticle, IConfigFile } from "./types.d.ts";
  import Api from "./api.ts";
  // ***************
  // FUNCTIONS
  // ***************
  
  const setApiKey = (parsedArgs: Args): void => {
    // Get home directory address
    let homeEnv: string | undefined = Deno.env.get("HOME");
    let home: string = "";
    if (typeof homeEnv === "string") home = homeEnv;
    let configFilePath: string = `${home}/.newzzer.json`;
    //   Check if api-key is provided
    if (typeof parsedArgs.config === "string") {
      //   If the file is not present, then create file
      if (!existsSync(configFilePath)) {
        Deno.createSync(configFilePath);
      }
      // Write apiKey in the file
      writeJsonSync(configFilePath, { apiKey: parsedArgs.config });
      console.log(`${green(bold("Success"))} ApiKey set Successfully`);
      displayHelpAndQuit();
    } //   Handling if apiKey is not present after --config
    else displayHelpAndQuit("Config flag should be followed by apiKey");
  };
  
  const getApiKey = (): any => {
    // Get home directory address
    let homeEnv: string | undefined = Deno.env.get("HOME");
    let home: string = "";
    if (typeof homeEnv === "string") home = homeEnv;
    let configFilePath: string = `${home}/.newzzer.json`;
    try {
      //   try to read ~/.newzzer.json
      let file = readJsonSync(configFilePath);
      if (typeof file === "object" && file !== null) {
        let configFile = file as IConfigFile;
        if (configFile.apiKey) return configFile.apiKey;
        //   If apiKey not present in file show error
        else displayHelpAndQuit("apiKey not found in the config file ");
      }
    } catch (err) {
      //    if file is not present, show error message and quit
      displayHelpAndQuit("Config file not present. Use --config to set apiKey");
    }
  };
  
  const displayBanner = (): void => {
    // Clears the terminal
    console.clear();
    console.log(bold("---------------"));
    console.log(
      bold(
        green(`
     Newzzer
  `),
      ),
    );
    console.log(bold("---------------"));
    console.log(
      bold(
        green(
          `\nFind your quick news byte at your terminal. Powered by News API\n`,
        ),
      ),
    );
  };
  
  const displayArticles = (news: IArticle[]): void => {
    if (news.length === 0) {
      console.log(magenta(`Uh Oh! Looks like we cannot find any news`));
    }
    news.forEach((article: IArticle, i: number) => {
      console.log(bold(magenta(`   ${i + 1}\t${article.title}`)));
      if (article.description) console.log(`\t${article.description}`);
      if (article.url) {
        console.log(cyan(`${bold(`\tMore info:`)} ${article.url}\n`));
      }
    });
  };
  
  const invalidCategory = (category?: string): boolean => {
    if (category === undefined) return true;
    const validCategories: Set<string> = new Set([
      "business",
      "entertainment",
      "general",
      "health",
      "science",
      "sports",
      "technology",
    ]);
    return !validCategories.has(category);
  };
  
  const showFlags = (parsedArgs: Args): void => {
    let flagToName: Map<string, string> = new Map([
      ["q", "query"],
      ["c", "category"],
    ]);
    let flagsInfo: string[] = [];
    Object.keys(parsedArgs).forEach((arg) => {
      if (arg !== "_") {
        let argName = flagToName.has(arg) ? flagToName.get(arg) : arg;
        flagsInfo.push(`${green(`${argName}: `)}${parsedArgs[arg]}`);
      }
    });
    console.log(`Getting news by- \t${flagsInfo.join("\t")}\n`);
  };
  
  // ***************
  // Main method
  // ***************
  if (import.meta.main) {
    const { args } = Deno;
    const parsedArgs = parse(args);
    displayBanner();
    //   If option to set API Key i.e. --config flag is passed
    if (parsedArgs.config) setApiKey(parsedArgs);
    //   otherwise Check for API key
    let apiKey: string = getApiKey();
    const apiClient: Api = new Api(apiKey);
    //   Show flags passed as inputs if not config and other flag is set
    if (
      parsedArgs.config === undefined &&
      args.length !== 0 &&
      !parsedArgs.help &&
      !parsedArgs.h
    ) {
      showFlags(parsedArgs);
    }
  
    //   Check if all flags are valid
    if (parsedArgs.category) {
      let error = invalidCategory(parsedArgs.category);
      if (error) {
        displayHelpAndQuit("Invalid category value found");
      }
    }
  
    if (args.length === 0 || parsedArgs.h || parsedArgs.help) {
      displayHelpAndQuit();
    } else if (
      parsedArgs.c ||
      parsedArgs.category ||
      parsedArgs.query ||
      parsedArgs.q
    ) {
      let category = parsedArgs.category || parsedArgs.c;
      let query = parsedArgs.query || parsedArgs.q;
      let newsResponse = await apiClient.getNews(category, query);
      if (typeof newsResponse === "object") displayArticles(newsResponse);
      else displayHelpAndQuit(newsResponse);
    } else displayHelpAndQuit("Invalid argument");
  }