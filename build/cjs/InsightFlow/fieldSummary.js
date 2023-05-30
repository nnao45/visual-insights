import { getFieldEntropy, getFieldType, getFloatFieldEntropy } from '../univariateSummary';
import { BIN_NUM_FOR_ANALYTIC } from '../constant';
import { getRangeBy } from '../statistics';
const TESTS = {
    boolean(x) {
        return x === 'true' || x === 'false' || x === true || x === false;
    },
    integer(x) {
        return TESTS.number(x) && (x = +x) === ~~x;
    },
    number(x) {
        return !isNaN(+x);
    },
    date(x) {
        return !isNaN(Date.parse(x));
    },
};
function isValid(obj) {
    return obj != null && obj === obj;
}
export function inferDataType(values) {
    // types to test for, in precedence order
    const types = ['boolean', 'integer', 'number', 'date'];
    for (let value of values) {
        // test value against remaining types
        for (let j = 0; j < types.length; ++j) {
            if (isValid(value) && !TESTS[types[j]](value)) {
                types.splice(j, 1);
                j -= 1;
            }
        }
        // if no types left, return 'string'
        if (types.length === 0)
            return 'string';
    }
    return types[0];
}
// 实现约束：必须保证fieldKeys与fields的顺序相同。engine依赖了这样的顺序，否则会产生逻辑错误。
export function getFieldsSummary(fieldKeys, dataSource) {
    const fields = [];
    const dictonary = new Map();
    for (let f of fieldKeys) {
        const valueMap = new Map();
        dataSource.forEach(row => {
            if (!valueMap.has(row[f])) {
                valueMap.set(row[f], 0);
            }
            valueMap.set(row[f], valueMap.get(row[f]) + 1);
        });
        const dataType = inferDataType([...valueMap.keys()]);
        const semanticType = getFieldType(dataSource, f);
        let maxEntropy = Math.log2(valueMap.size);
        let entropy = maxEntropy;
        let _max = -Infinity;
        let _min = Infinity;
        let analyticType = 'dimension';
        let useFloatEntropy = false;
        if ((dataType === 'integer' || dataType === 'number') && semanticType !== 'ordinal') {
            analyticType = 'measure';
            if (valueMap.size > BIN_NUM_FOR_ANALYTIC) {
                let info = getFloatFieldEntropy(dataSource, f);
                entropy = info.entropy;
                maxEntropy = info.maxEntropy;
                useFloatEntropy = true;
                [_min, _max] = getRangeBy(dataSource, f);
            }
        }
        if (!useFloatEntropy) {
            let info = getFieldEntropy(dataSource, f);
            entropy = info.entropy;
            maxEntropy = info.maxEntropy;
        }
        let field = {
            key: f,
            analyticType,
            semanticType,
            dataType,
            features: {
                unique: valueMap.size,
                size: dataSource.length,
                entropy,
                maxEntropy,
                min: _min,
                max: _max
            }
        };
        fields.push(field);
        dictonary.set(field.key, field);
    }
    return {
        fields,
        dictonary
    };
}
