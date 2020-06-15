// ***************
// IMPORTS
// ***************
import { parse, green, bold } from "./deps.ts";
import { displayHelpAndQuit } from "./error.ts";
// ***************
// FUNCTIONS
// ***************

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
  if (args.length === 0 || parsedArgs.h || parsedArgs.help) {
    displayHelpAndQuit();
  } else displayHelpAndQuit("Invalid argument");
}
