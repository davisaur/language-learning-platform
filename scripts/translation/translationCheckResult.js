function checkResult() {
    const selectedWords = Array.from(translatedWordList.querySelectorAll('.button')).map(button => button.dataset.word);
    const isCorrect = expectedResult.length === selectedWords.length && expectedResult.every((word, index) => word === selectedWords[index]);
    
    const resultContainer = document.querySelector('.overlay-result-container');
    resultContainer.hidden = false;
    if (isCorrect) {
        const correctResult = document.querySelector('.correct-result');
        correctResult.hidden = false;
    } else {
        const incorrectResult = document.querySelector('.incorrect-result');
        incorrectResult.hidden = false;
    }
}