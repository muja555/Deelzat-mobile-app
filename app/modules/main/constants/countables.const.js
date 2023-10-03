const CountedWord = {};

CountedWord.YEARS = 'YEARS'
CountedWord.MONTHS = 'months'
CountedWord.DAYS = 'DAYS'
CountedWord.HOURS = 'HOURS'
CountedWord.MINUTES = 'MINUTES'
CountedWord.SECONDS = 'SECONDS'

Object.freeze(CountedWord);
export default CountedWord;

const words = {
    [CountedWord.YEARS]:  ['سنة', 'سنتان', 'سنوات'],
    [CountedWord.MONTHS]: ['شهر', 'شهران', 'شهور'],
    [CountedWord.DAYS]: ['يوم', 'يومان', 'أيام'],
    [CountedWord.HOURS]: ['ساعة', 'ساعتين', 'ساعات'],
    [CountedWord.MINUTES]: ['دقيقة', 'دقيقتين', 'دقائق'],
    [CountedWord.SECONDS]: ['ثانية', 'ثانيتين', 'ثواني'],
}


const getCountableWord = (count, countedType: CountedWord) => {
    const isAr = true;

    let index;
    if(count <= 0 || (count > 2 && count < 11)) {
        index = 0
    } else if (count <= 2) {
        index = count - 1
    } else {
        index  = isAr? 0 : 2
    }

    if (isAr && count !== 1 && count !== 2) {
        return `${count} ${words[countedType][index]}`
    } else {
        return words[countedType][index]
    }
}

export {getCountableWord as getCountableWord}


