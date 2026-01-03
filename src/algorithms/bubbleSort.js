export async function* bubbleSort(array) {
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            yield { type: 'compare', indices: [j, j + 1], array: [...arr], line: 5 };

            if (arr[j].value > arr[j + 1].value) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                yield { type: 'swap', indices: [j, j + 1], array: [...arr], line: 8 };
            }
        }
        yield { type: 'sorted', indices: [n - i - 1], array: [...arr], line: 11 };
    }
}