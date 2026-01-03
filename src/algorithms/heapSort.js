export async function* heapSort(array) {
    let arr = [...array];
    let n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        yield { type: 'swap', indices: [0, i], array: [...arr] };
        yield { type: 'sorted', indices: [i], array: [...arr] };
        yield* heapify(arr, i, 0);
    }
    yield { type: 'sorted', indices: [0], array: [...arr] };
}

async function* heapify(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n) {
        yield { type: 'compare', indices: [left, largest], array: [...arr] };
        if (arr[left].value > arr[largest].value) largest = left;
    }

    if (right < n) {
        yield { type: 'compare', indices: [right, largest], array: [...arr] };
        if (arr[right].value > arr[largest].value) largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        yield { type: 'swap', indices: [i, largest], array: [...arr] };
        yield* heapify(arr, n, largest);
    }
}
