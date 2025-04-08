const originalText = document.querySelector('#originalText');
const sourceWordList = document.querySelector('#sourceWordList');
const translatedWordList = document.querySelector('#translatedWordList');

const translation = {
    "sourceText": "The quick brown fox jumps over the lazy dog",
    "translatedText": "El rápido zorro marrón salta sobre el perro perezoso"
}

const expectedResult = translation.translatedText.split(' ').map(word => word.toLowerCase());
const scrambledWordList = expectedResult.slice().sort(() => Math.random() - 0.5);

originalText.textContent = translation.sourceText;

for (const word of scrambledWordList) {
    const button = document.createElement('button');
    button.className = 'button';
    button.textContent = word;
    button.dataset.word = word.toLowerCase();
    button.onclick = function () {
    addToTranslation(button);
    };
    sourceWordList.appendChild(button);
}