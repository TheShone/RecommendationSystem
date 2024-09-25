const cron = require("node-cron");
const { calculateAndStoreSimilarUsers } = require("./batchScriptService"); 

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Script starts...");
    await calculateAndStoreSimilarUsers();
    console.log("Script ends.");
  } catch (error) {
    console.error("Greška prilikom izvršavanja skripte:", error);
  }
});
