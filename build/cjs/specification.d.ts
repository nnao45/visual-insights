import { DataSource, FieldImpurity, View } from './commonTypes';
declare function specification(dimScores: FieldImpurity[], aggData: DataSource, dimensions: string[], measures: string[]): View;
export default specification;
