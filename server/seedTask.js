const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const users = data.users;
const products = data.products;
const reviews = data.reviews;

const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();

  // Product samples
  const p1 = products.addProduct(
    "VS Code",
    "Visual Studio Code is a source-code editor made by Microsoft for Windows, Linux and macOS. Features include support for debugging, syntax highlighting, intelligent code completion, snippets, code refactoring, and embedded Git.",
    "https://code.visualstudio.com",
    ["IDE", "Code", "Open Source", "Free"],
    "Microsoft",
    "1638724564615VS_code.png"
  );
  const p2 = products.addProduct(
    "Favelent",
    "We want to crystalize your most-favourite content and let you represent it to the world!Share your Profile with your audience whenever they ask for recommendations. Collect E-Mails and add your social links Discover the best findings of others.",
    "https://favelent.com",
    ["Productivity"],
    "heyfavy",
    //TODO: confirm once with everyone
    "1638724564615VS_code.png"
  );

  //End
  await db.serverConfig.close();
};
main().catch((e) => {
  console.log(e);
});
