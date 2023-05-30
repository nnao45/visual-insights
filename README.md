# Visual-Insights

![](https://travis-ci.org/kanaries/visual-insights.svg?branch=master)
![](https://img.shields.io/npm/v/visual-insights?color=blue)
[![Coverage Status](https://coveralls.io/repos/github/Kanaries/visual-insights/badge.svg?branch=master)](https://coveralls.io/github/Kanaries/visual-insights?branch=master)

Visual-Insights is an automated data analysis and visualization recommendation pipeline tool. It can find patterns in your datasets and choosen a efficiency way to express it with a visual design.

[Rath](https://github.com/Kanaries/Rath) is a augmented analytic and automated data analysis tools built based on `visual-insights`.


## API


```js
import { VIEngine } from 'visual-insights';

const vie = new VIEngine();

vie.setDataSource(dataSource);
    .setFieldKeys(keys);
```

`VIEngine` does not auto info analytic type of fields(dimension or measure), analytic types can only be controled by user through `setDimensions` and `setMeasures`


### buildFieldsSummary
VIEngine stores field informatiion, which contains
```typescript
interface IField {
    key: string;
    name?: string;
    analyticType: IAnalyticType;
    semanticType: ISemanticType;
    dataType: IDataType;
}
```

analyticType is set by `setDimensions/Measures`, while semanticType and dataType are automated infered through data.

```js
const fields = vie.buildFieldsSummary()
    .fields;
```
`buildFieldsSummary` computes fields and fieldDictonary and store them in vi engine. While those two property can be infered from each other, we still store both of them for the reason that they will be frequently used in future.

after get fields, you can get details of them in vi engine, according to which you can use to decide which of them are dimensions and measures. 
```js
vie.setDimensions(dimensions);
    .setMeasures(measures);
```

### buildGraph
```ts
vie.buildGraph();
```

+ result will be stored at vie.dataGraph.
+ you should make sure vie.(dimensions, measures, dataSource) are defined so as to use buildGraph.

### clusterFields
-> 
+ dataGraph.DClusters
+ dataGraph.MClusters


### buildCube

buildCube will build a kylin-like cube. it uses the cluster result as base cuboids which save a lot of costs.

### getCombinationFromClusterGroups

it gets the clustering result and generates combination in each cluster. It is an internal API mainly be used by buildSubspaces.

### buildSubspaces
`buildSubspaces` generate all subspaces(dimensions&measurs). VIEngine has a algorithm which reduce the size of all answer space, so you don't need to worry about it.


```ts
public buildSubspaces(
    DIMENSION_NUM_IN_VIEW: ConstRange = this.DIMENSION_NUM_IN_VIEW,
    MEASURE_NUM_IN_VIEW: ConstRange = this.MEASURE_NUM_IN_VIEW
): VIEngine

interface ConstRange {
    MAX: number;
    MIN: number;
}
```

examples
```ts
vie.buildSubspaces();
vie.buildSubspaces({ MAX: 5, MIN: 2}, {MAX: 2, MIN: 1});
```

`buildSubspaces` depends on dataGraph, so make sure `buildDataGraph` and `clusterFields` are called before you use `buildSubspaces`.

### insightExtraction

It enumerates all subspaces generated before, it checks the significance of different patterns or insights. it is a async methods, for some of the pattern checker can be run on different threads or machine.
```ts
public async insightExtraction(viewSpaces: ViewSpace[] = this.subSpaces): Promise<IInsightSpace[]>
```

```ts
vie.insightExtraction()
    .then(spaces => {
        console.log(spaces)
    })
```

### setInsightScores

insight scoring algorithm, which set final scores for item in insightSpaces.
```ts
vie.setInsightScores();
```

### specification


map a insightSpace into visual specification. it will recommanded encoding based on expressiveness and effectiveness.

```ts
public specification(insightSpace: IInsightSpace)
```

## LISCENSE
visual-insights is a automated pattern discovery and visualization design lib. It provides high dimensional auto EDA and visual design algorithm.

Copyright (C) 2019  Observed Observer(Hao Chen)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.