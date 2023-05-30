import { memberCount } from './utils/index';
function isUniformDistribution(dataSource, field) {
    const members = memberCount(dataSource, field);
    return members.every(member => member[1] === 1);
}
export { isUniformDistribution };
