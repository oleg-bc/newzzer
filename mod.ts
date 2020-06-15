
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
  } from "./deps.ts";
  import { displayHelpAndQuit } from "./error.ts";
  import { IArticle, IConfigFile } from "./types.d.ts";
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
    console.log(`Found API key: ${apiKey}`);
    if (args.length === 0 || parsedArgs.h || parsedArgs.help) {
      displayHelpAndQuit();
    } else displayHelpAndQuit("Invalid argument");
  }
  view rawmod-addKey.ts hosted with ❤ by GitHub