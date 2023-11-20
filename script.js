// Function to show/hide input sections based on user's choice
function toggleInputSection() {
    const sourceSelect = document.getElementById('source-select');
    const userInputSection = document.getElementById('input-section');
    const wikipediaSection = document.getElementById('wikipedia-section');

    if (sourceSelect.value === 'user-input') {
        userInputSection.style.display = 'block';
        wikipediaSection.style.display = 'none';
    } else {
        userInputSection.style.display = 'none';
        wikipediaSection.style.display = 'block';
    }
}

// Attach an event listener to the source select input
const sourceSelect = document.getElementById('source-select');
sourceSelect.addEventListener('change', toggleInputSection);

// Function to fetch Wikipedia article text using the Wikipedia API
async function fetchWikipediaArticle(topic) {
    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`);
        const data = await response.json();
        console.log("i am data", data, "i am data extract", data.extract)
        return data.extract;
    } catch (error) {
        console.error('Error fetching Wikipedia article:', error);
        return null;
    }
}

// Function to tokenize the input and display it
function tokenizeInput() {
    const sourceSelect = document.getElementById('source-select');
    const tokenizedWordsContainer = document.getElementById('tokenized-words');

    let inputText;
    if (sourceSelect.value === 'user-input') {
        inputText = document.getElementById('input-text').value;
        tokenize(inputText, tokenizedWordsContainer)
        
    } else {
        const wikipediaTopic = document.getElementById('wikipedia-topic').value;
        // Fetch the Wikipedia article text
        fetchWikipediaArticle(wikipediaTopic)
            .then(articleText => {
                if (articleText) {
                    // Use the fetched Wikipedia article text as input
                    document.getElementById('input-text').value = articleText;
                    inputText = articleText;
                    tokenize(inputText, tokenizedWordsContainer)
                } else {
                    inputText = null;
                }
            });
    }

    console.log("inputText", inputText)

}

function tokenize(inputText, tokenizedWordsContainer)
{
    
    if (inputText !== null) {
        // Clear the existing content
        tokenizedWordsContainer.innerHTML = '';

        // Tokenize the input text into an array of words
        const words = inputText.split(/\s+/);

        // Create and display pill-shaped buttons for each word
        words.forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = word;

            const pillButton = document.createElement('button');
            pillButton.classList.add('pill-button');
            pillButton.appendChild(wordSpan);

            tokenizedWordsContainer.appendChild(pillButton);
        });
    }
}

// Attach an event listener to the tokenize button
const tokenizeButton = document.getElementById('tokenize-button');
tokenizeButton.addEventListener('click', tokenizeInput);


// Function to download CSV
function downloadCSV(data) {
    const csvData = data.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tokenized_words.csv';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

// Function to copy CSV to clipboard
function copyCSV(data) {
    const csvData = data.join('\n');
    const textarea = document.getElementById('csv-data');
    textarea.value = csvData;
    textarea.select();
    document.execCommand('copy');
    alert('CSV data copied to clipboard');
}

// Attach event listeners to the download and copy buttons
const downloadButton = document.getElementById('download-csv');
const copyButton = document.getElementById('copy-csv');

downloadButton.addEventListener('click', function () {
    const tokenizedWords = getTokenizedWords(); // Replace with your function to retrieve tokenized words
    downloadCSV(tokenizedWords);
});

copyButton.addEventListener('click', function () {
    const tokenizedWords = getTokenizedWords(); // Replace with your function to retrieve tokenized words
    copyCSV(tokenizedWords);
});
