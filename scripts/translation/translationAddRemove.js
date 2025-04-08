function addToTranslation(button) {
            // Add to right column without removing from left column
            const newButton = document.createElement('button');
            newButton.className = 'button';
            newButton.textContent = button.textContent;
            newButton.dataset.word = button.dataset.word;
            newButton.onclick = function () {
            removeFromTranslation(newButton);
            };
            translatedWordList.appendChild(newButton);

            // add class to the button
            button.classList.add('added-button');
            button.disabled = true;
        }

        function removeFromTranslation(button) {
            // Remove from right column
            translatedWordList.removeChild(button);

            // Enable the original button in the left column
            const originalButtons = sourceWordList.querySelectorAll(`[data-word="${button.dataset.word}"]`);
            for (const originalButton of originalButtons) {
            if (originalButton.disabled) {
                originalButton.disabled = false;
                originalButton.classList.remove('added-button');
                break;
            }
            }
        }