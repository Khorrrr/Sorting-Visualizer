export async function* selectionSort(array) {
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
            yield { type: 'compare', indices: [minIdx, j], array: [...arr], line: 6 };
            if (arr[j].value < arr[minIdx].value) {
                minIdx = j;
            }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        yield { type: 'swap', indices: [i, minIdx], array: [...arr], line: 9 };
        yield { type: 'sorted', indices: [i], array: [...arr], line: 10 };
    }
}