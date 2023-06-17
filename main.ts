import {
  readCSVObjects,
  writeCSVObjects,
} from "https://deno.land/x/csv@v0.8.0/mod.ts";

interface Trading212Data {
  Action: string;
  Time: string;
  ISIN: string;
  Ticker: string;
  Name: string;
  "No. of shares": string;
  "Price / share": string;
  "Currency (Price / share)": string;
  "Exchange rate": string;
  "Total (GBP)": string;
  ID: string;
  "Currency conversion fee (GBP)": string;
}

interface DIVTrackerData {
  Ticker: string;
  Quantity: string;
  "Cost Per Share": string;
  Date: string;
  Commission: string;
}

async function convertTrading212ToDIVTracker(
  inputFilePath: string,
  outputFilePath: string,
) {
  const inputCSV = await Deno.open(inputFilePath);
  const outputCSV = await Deno.open(outputFilePath, {
    create: true,
    write: true,
    truncate: true,
  });

  let count = 0;
  let total = 0;

  const gen = async function* () {
    for await (const row of readCSVObjects(inputCSV)) {
      let cost = parseFloat(row["Price / share"]);
      if (row["Currency (Price / share)"] === "GBX") {
        cost = cost / 100;
      }
      const out = {
        Ticker: row.Ticker + ".GB",
        Quantity: row["No. of shares"],
        "Cost Per Share": cost.toString(),
        Date: row.Time.split(" ")[0],
        Commission: row["Currency conversion fee (GBP)"],
      };

      yield out;
      total = total + parseFloat(row["Total (GBP)"]);
      count++;
    }
  };

  await writeCSVObjects(outputCSV, gen(), {
    header: [
      "Ticker",
      "Quantity",
      "Cost Per Share",
      "Date",
      "Commission",
    ],
  });

  inputCSV.close();

  outputCSV.close();

  console.log("✅ Conversion complete.");
  console.table({
    "Trades": count,
    "Total": total,
  });
}

const inputFilePath = "trading212.csv";
const outputFilePath = "divTracker.csv";

await convertTrading212ToDIVTracker(inputFilePath, outputFilePath);
