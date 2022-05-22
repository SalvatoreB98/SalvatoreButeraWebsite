export function lowPolySea(array){
    for(let i = 0; i< array.length ; i+=3){
        const x = array[i];
        const y = array[i+1];
        const z = array[i+2];
        array[i + 2] = z + Math.random() / 2;
      }
}