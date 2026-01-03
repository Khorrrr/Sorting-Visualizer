export async function* mergeSort(array) {
    let arr = [...array];
    yield* mergeSortHelper(arr, 0, arr.length - 1);
}

async function* mergeSortHelper(arr, start, end) {
    if (start >= end) return;

    let mid = Math.floor((start + end) / 2);
    yield* mergeSortHelper(arr, start, mid);
    yield* mergeSortHelper(arr, mid + 1, end);
    yield* merge(arr, start, mid, end);
}

async function* merge(arr, start, mid, end) {
    let left = arr.slice(start, mid + 1);
    let right = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        yield { type: 'compare', indices: [start + i, mid + 1 + j], array: [...arr] };
        if (left[i].value <= right[j].value) {
            arr[k] = left[i];
            i++;
        } else {
            arr[k] = right[j];
            j++;
        }
        yield { type: 'swap', indices: [k], array: [...arr] };
        k++;
    }

    while (i < left.length) {
        arr[k] = left[i];
        yield { type: 'swap', indices: [k], array: [...arr] };
        i++;
        k++;
    }

    while (j < right.length) {
        arr[k] = right[j];
        yield { type: 'swap', indices: [k], array: [...arr] };
        j++;
        k++;
    }

    let sortedIndices = [];
    for (let idx = start; idx <= end; idx++) sortedIndices.push(idx);
    yield { type: 'sorted', indices: sortedIndices, array: [...arr] };
}
