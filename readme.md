# PDF Splitter

This Node.js script leverages the `pdf-lib` and `pdf-parse` libraries to extract information from a PDF file and split it into multiple files based on specified criteria.

## Prerequisites

Before running the script, make sure you have Node.js installed on your system.

```bash
npm install
```

## Run the Script

To execute the script, use the following command in your terminal:

```bash
node index.js <inputFilePath> <indexKey> <maxPage> <postfix>
```

- `<inputFilePath>`: Path to the input PDF file.
- `<indexKey>`: Keyword used to identify the data to extract (e.g., "Mã HS:").
- `<maxPage>`: Maximum number of pages to process (set to 0 to render all pages).
- `<postfix>`: Add extra value to the end of the file. 

### Example:

```bash
node index.js path/to/input.pdf "Mã HS:" 4 "_KQ_1"
```

## Output

The script will create a folder named `outputs` in the current directory and save individual PDF files, each corresponding to a specific piece of extracted information.

Feel free to customize the script to fit your specific needs.