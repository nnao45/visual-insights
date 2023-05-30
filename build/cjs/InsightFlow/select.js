const FULL_FIELD_USE_THRESHOLD = 25;
const PARTS_FIELD_THRESHOLD = 500;
const fixOmiga = Math.round(Math.pow((100 - FULL_FIELD_USE_THRESHOLD), 2) / PARTS_FIELD_THRESHOLD);
export function autoFieldSelect(_fields) {
    const x = _fields.length;
    const fields = [..._fields];
    fields.sort((fa, fb) => fa.features.entropy - fb.features.entropy);
    if (x < FULL_FIELD_USE_THRESHOLD)
        return fields;
    if (x < PARTS_FIELD_THRESHOLD) {
        return fields.slice(0, Math.round(Math.sqrt(fixOmiga * (x - FULL_FIELD_USE_THRESHOLD)) + FULL_FIELD_USE_THRESHOLD));
    }
    else {
        return fields.slice(0, 100);
    }
}
export function fieldSelectByPercent(_fields, percent) {
    const x = _fields.length;
    const fields = [..._fields];
    fields.sort((fa, fb) => fa.features.entropy - fb.features.entropy);
    return fields.slice(0, Math.round(x * percent));
}
