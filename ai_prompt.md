i've made a language learning platform that takes a JSON object which contains an array of "activities". 

The activities include: 
- Translation: it takes each word from the translated text and jumbles it up and the user then puts it in the correct order.
- Match the words: you have to match the source words to the translations, the program rearranges the words and its up to the user to put them into order.
- Multiple choice: the user has to select the right answer from the given choice>

Here's how each activity is written out as an object:
- Translation
```json
{ 
    "type": "TRANSLATION",
    "question": {
        "sourceText": "The quick brown fox jumps over the lazy dog",
            "translatedText": "El rápido zorro marrón salta sobre el perro perezoso" 
        } 
}
```

- Match The Words
```json
{ 
    "type": "MATCH_THE_WORDS",
    "question": {
        "pairs": [
            { "source": "hello", "translation": "hola" },
            { "source": "house", "translation": "casa" },
            { "source": "eyes", "translation": "ojos" },
            { "source": "library", "translation": "biblioteca" }
        ]
    } 
}
```

- Multiple Choice (THERE SHOULD ONLY BE ONE CORRECT ANSWER)
```json
{
    "type": "MULTIPLE_CHOICE",
    "question": {
        "question": "What is the word for library?",
        "answers": [
        {"text": "biblioteca", "correct": true},
        {"text": "libreria", "correct": false},
        {"text": "libro", "correct": false},
        {"text": "libros", "correct": false}
    ]
    }
}
```
A lesson can contain as many activities as you, and they do not have to be in any particular order.
Knowing all of this, can you create 10 activity lesson on ordering food in Spanish and surround the JSON object in a "questions" array, like { "questions": [{ insert activities here}]}.