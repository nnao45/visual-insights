const DB_DATA_TYPE_TO_DATA_TYPE = {
    'Int8': 'integer',
    'Int16': 'integer',
    'Int32': 'integer',
    'Int64': 'integer',
    'UInt8': 'integer',
    'UInt16': 'integer',
    'UInt32': 'number',
    'UInt64': 'number',
    'Float32': 'number',
    'Float64': 'number',
    'BOOLEAN': 'boolean',
    'String': 'string'
};
const DEFAULT_SEMANTIC_TYPE = {
    'number': 'quantitative',
    'integer': 'quantitative',
    'boolean': 'nominal',
    'date': 'temporal',
    'string': 'nominal'
};
const DEFAULT_ANALYTIC_TYPE = {
    'number': 'measure',
    'integer': 'measure',
    'boolean': 'dimension',
    'date': 'dimension',
    'string': 'dimension'
};
export function dbDataType2DataType(dbDataType) {
    return DB_DATA_TYPE_TO_DATA_TYPE[dbDataType] || 'string';
}
export function inferSemanticTypeFromDataType(dataType) {
    return DEFAULT_SEMANTIC_TYPE[dataType];
}
export function inferAnalyticTypeFromDataType(dataType) {
    return DEFAULT_ANALYTIC_TYPE[dataType];
}
export function parseCell(rawValue, dataType) {
    switch (dataType) {
        case 'Int8':
        case 'Int16':
        case 'Int32':
        case 'Int64':
        // case 'Int128':
        // case 'Int256':
        case 'UInt8':
        case 'UInt16':
        case 'UInt32':
        case 'UInt64':
            return parseInt(rawValue);
        case 'Float32':
        case 'Float64':
            return Number(rawValue);
        default:
            return rawValue;
    }
}
export function parseTable(str, fields) {
    const rows = [];
    const rawRows = str.substring(0, str.length - 1).split('\n');
    for (let rawRow of rawRows) {
        const row = {};
        const rowValues = rawRow.split(/[\t]/);
        for (let i = 0; i < fields.length; i++) {
            row[fields[i].fid] = parseCell(rowValues[i], fields[i].dataType);
        }
        rows.push(row);
    }
    return rows;
}
