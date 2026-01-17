export async function* quickSort(array, left = 0, right = array.length - 1) {
    if (left >= right) {
        if (left === right) yield { type: 'sorted', indices: [left], array: [...array] };
        return;
    }

    let pivotIdx = yield* partition(array, left, right);
    yield* quickSort(array, left, pivotIdx - 1);
    yield* quickSort(array, pivotIdx + 1, right);
}

async function* partition(arr, left, right) {
    let pivot = arr[right];
    let i = left - 1;
    for (let j = left; j < right; j++) {
        yield { type: 'compare', indices: [j, right], array: [...arr] };
        if (arr[j].value < pivot.value) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            yield { type: 'swap', indices: [i, j], array: [...arr] };
        }
    }
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    yield { type: 'swap', indices: [i + 1, right], array: [...arr] };
    yield { type: 'sorted', indices: [i + 1], array: [...arr] };
    return i + 1;
}