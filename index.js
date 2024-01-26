const { PDFDocument } = require('pdf-lib');
const pdf = require('pdf-parse');
const fs = require('fs/promises');

async function getFileNamesFromFile(inputPath, indexKey, maxPage) {
    let dataBuffer = await fs.readFile(inputPath);
    const data = await pdf(dataBuffer, {
        max: maxPage
    });

    // number of pages
    console.log(data.numpages);
    // number of rendered pages
    console.log(data.numrender);
    // PDF info
    console.log(data.info);
    // PDF metadata
    // console.log(data.metadata);
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    // console.log(data.version);
    // PDF text
    // console.log(data.text);

    const hs = extractDataAfterIndexKey(data.text, indexKey);
    console.log("hs: ", hs);
    return hs;
}

function extractDataAfterIndexKey (text, indexKey) {
    const lines = text.split('\n');
    const dataArray = [];
    const regex = new RegExp(`${indexKey}(.*)`);

    for (const line of lines) {
        const match = line.match(regex);
        if (match && match[1]) {
            const data = match[1].trim();
            dataArray.push(data);
        }
    }

    return dataArray;
}

async function splitPDF (inputPath, outputPath, fileNames) {
    // Read the input PDF file
    const inputBuffer = await fs.readFile(inputPath);
    const pdfDoc = await PDFDocument.load(inputBuffer);

    // Check if the number of provided file names matches the number of pages
    if (fileNames.length > pdfDoc.getPageCount()) {
        throw new Error('Number of file names does not match the number of pages');
    }

    // Iterate through each page in the PDF
    for (let i = 0; i < fileNames.length; i++) {
        // Create a new PDF document for each page
        const newDoc = await PDFDocument.create();
        const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);

        // Add the copied page to the new document
        newDoc.addPage(copiedPage);

        // Save the new document to a separate PDF file with the specified name
        const outputFilePath = `${outputPath}/${fileNames[i]}.pdf`;
        await fs.writeFile(outputFilePath, await newDoc.save());

        console.log(`Page ${i + 1} saved to ${outputFilePath}`);
    }
}

async function exportFiles (inputFilePath, outputFolderPath, indexKey, maxPage) {
    const fileNames = await getFileNamesFromFile(inputFilePath, indexKey, parseInt(maxPage));

    splitPDF(inputFilePath, outputFolderPath, fileNames)
        .then(() => console.log('PDF split successfully'))
        .catch((error) => console.error('Error:', error));
}

// Command line arguments
const outputFolderPath = './outputs';
const inputFilePath = process.argv[2];
const indexKey = process.argv[3]; // Example: Mã HS:
const maxPage = process.argv[4]; // Example: 4, pass 0 to render all

// Check if required arguments are provided
if (!inputFilePath || !outputFolderPath || !indexKey || !maxPage) {
    console.error('Usage: node index.js <inputFilePath> <indexKey> <maxPage>');
    process.exit(1); // Exit with an error code
}

exportFiles(inputFilePath, outputFolderPath, indexKey, maxPage);
