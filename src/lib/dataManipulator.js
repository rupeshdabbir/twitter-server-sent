export function buildKey(filter) {
    const mapper = {'()': 'includes', '=': 'equal', '<>': 'match'};
    let finalKey = '';
    const { items } = filter;
    let source = [];

    items.forEach( each => {
        if(each.items) {
            source = [...source, ...each.items];
        } else {
            source.push(each);
        }
    });

    source.forEach( (each,i) => {
        const {key, field, operator, value} = each;
        const finalOperator = mapper[operator];
        
        if(finalOperator === 'includes') {
            finalKey += `${field}.${finalOperator}('${value}')`;
        } else if(finalOperator === 'equal') {
            finalKey += `${field} === '${value}'`;
        } else { //regex
            finalKey += `${field}.match(${value})`;
        }

        // append '&'
        if(i !== source.length-1) finalKey += ' && ';
    });

    return finalKey;
}

export function getFilteredData(filter, data, key) {
    console.log("Key is", key);
    const result = data.filter(record => {
        if(eval('record.'+key)) {
            return true;
        }
    });
    return result;
 }
 