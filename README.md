# Trading212 to DIVTracker CSV converter

This is a simple quick script to convert the exported Trading212 CSV formatted data to [DivTracker app](https://divtracker.app/) CSV data.

## Usage

You'll need to put a `trading212.csv` file in the working directory.

```bash
deno run --allow-read --allow-write main.ts
```

Running the script will output a `divTracker.csv`, you can then transfer this file to your phone for use with the app.

## License

MIT: https://kylewelsby.mit-license.org
