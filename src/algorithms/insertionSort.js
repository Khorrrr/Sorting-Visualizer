export async function* insertionSort(array) {
    let arr = [...array];
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        yield { type: 'compare', indices: [j, i], array: [...arr], line: 7 };

        while (j >= 0 && arr[j].value > key.value) {
            arr[j + 1] = arr[j];
            yield { type: 'swap', indices: [j, j + 1], array: [...arr], line: 9 };
            j = j - 1;
        }
        arr[j + 1] = key;
        yield { type: 'sorted', indices: Array.from({ length: i + 1 }, (_, k) => k), array: [...arr], line: 12 };
    }
    yield { type: 'sorted', indices: arr.map((_, i) => i), array: [...arr] };
}