class AnalyticsProcessor {
    constructor(rawData) {
        this.rawData = rawData;
        
        //  entity types and their variations
        this.entities = {
            'companies': ['company', 'companies'],
            'funds': ['fund', 'funds'],
            'countries': ['country', 'countries'],
            'themes': ['theme', 'themes']
        };

        //  metric types and their variations
        this.metrics = {
            'investment': ['investment', 'investments'],
            'fund size': ['fund size', 'fundsize', 'size'],
            'emissions': ['emission', 'emissions'],
            'global south': ['global south', 'globalsouth'],
            'deals': ['deal', 'deals'],
            'capital': ['capital', 'capital catalyzed']
        };

        // column mappings
        this.columnMappings = {
            'companies': 'companyName',
            'funds': 'fund',
            'countries': 'country',
            'themes': 'theme',
            'investment': ['investment'],
            'fund size': ['fundSize'],
            'emissions': ['totalEmissions', 'scope1Emissions', 'scope2Emissions', 'scope3Emissions'],
            'global south': ['globalSouthDeals', 'globalSouthCountries'],
            'deals': ['fundInvestments'],
            'capital': ['themeCapitalCatalyzed']
        };
    }

    analyzeData(query) {
        const queryLower = query.toLowerCase();

        //  for overall analysis
        if (queryLower.includes('overall')) {
            return this.getOverallAnalysis(queryLower);
        }

        //  matching entity
        const entity = Object.keys(this.entities).find(e => 
            this.entities[e].some(term => queryLower.includes(term))
        );

        if (!entity) {
            throw new Error('Please specify what you want to analyze (companies, funds, countries, or themes)');
        }

        //  matching metric
        const metric = Object.keys(this.metrics).find(m => 
            this.metrics[m].some(term => queryLower.includes(term))
        );

        if (!metric) {
            throw new Error('Please specify what metric you want to analyze (investment, fund size, emissions, etc)');
        }

        // Get column names
        const groupBy = this.columnMappings[entity];
        const metrics = this.columnMappings[metric];

        // Filter relevant columns
        const relevantData = this.rawData.map(row => {
            const filtered = {
                [groupBy]: row[groupBy]
            };
            metrics.forEach(m => {
                filtered[m] = row[m];
            });
            return filtered;
        });

        // Aggregate data
        const aggregation = new Map();
        
        relevantData.forEach(row => {
            const key = row[groupBy];
            if (!key) return;

            if (!aggregation.has(key)) {
                aggregation.set(key, {
                    name: key,
                    ...Object.fromEntries(metrics.map(m => [m, 0]))
                });
            }

            metrics.forEach(m => {
                aggregation.get(key)[m] += parseFloat(row[m]) || 0;
            });
        });

        // Convert to array and sort
        const results = Array.from(aggregation.values())
            .sort((a, b) => b[metrics[0]] - a[metrics[0]])
            .slice(0, 10)
            .map(item => {
                const formatted = { name: item.name };
                metrics.forEach(m => {
                    formatted[m] = {
                        raw: item[m],
                        display: this.formatValue(m, item[m])
                    };
                });
                return formatted;
            });

        return {
            type: `${entity} by ${metric}`,
            groupBy,
            metrics,
            data: results
        };
    }

    getOverallAnalysis(query) {
        // Determine entity type
        const entity = Object.keys(this.entities).find(e => 
            this.entities[e].some(term => query.includes(term))
        );

        if (!entity) {
            throw new Error('Please specify what you want to analyze (companies, funds, countries, or themes)');
        }

        // Define metrics to include for each entity type
        const overallMetrics = {
            'companies': {
                groupBy: 'companyName',
                metrics: {
                    'investment': ['investment'],
                    'fundSize': ['fundSize'],
                    'emissions': ['totalEmissions'],
                    'deals': ['fundInvestments'],
                    'globalSouth': ['globalSouthDeals']
                }
            },
            'funds': {
                groupBy: 'fund',
                metrics: {
                    'investment': ['investment'],
                    'fundSize': ['fundSize'],
                    'deals': ['fundInvestments'],
                    'globalSouth': ['globalSouthDeals']
                }
            },
            'countries': {
                groupBy: 'country',
                metrics: {
                    'investment': ['investment'],
                    'emissions': ['totalEmissions'],
                    'globalSouth': ['globalSouthDeals']
                }
            },
            'themes': {
                groupBy: 'theme',
                metrics: {
                    'investment': ['investment'],
                    'capital': ['themeCapitalCatalyzed'],
                    'deals': ['fundInvestments']
                }
            }
        };

        const config = overallMetrics[entity];
        const groupBy = config.groupBy;
        const allMetrics = Object.values(config.metrics).flat();

        // Filter relevant columns
        const relevantData = this.rawData.map(row => {
            const filtered = {
                [groupBy]: row[groupBy]
            };
            allMetrics.forEach(m => {
                filtered[m] = row[m];
            });
            return filtered;
        });

        // Aggregate data
        const aggregation = new Map();
        
        relevantData.forEach(row => {
            const key = row[groupBy];
            if (!key) return;

            if (!aggregation.has(key)) {
                aggregation.set(key, {
                    name: key,
                    ...Object.fromEntries(allMetrics.map(m => [m, 0]))
                });
            }

            allMetrics.forEach(m => {
                aggregation.get(key)[m] += parseFloat(row[m]) || 0;
            });
        });

        // Convert to array and sort by investment (primary metric)
        const results = Array.from(aggregation.values())
            .sort((a, b) => b[allMetrics[0]] - a[allMetrics[0]])
            .slice(0, 10)
            .map(item => {
                const formatted = { name: item.name };
                allMetrics.forEach(m => {
                    formatted[m] = {
                        raw: item[m],
                        display: this.formatValue(m, item[m])
                    };
                });
                return formatted;
            });

        return {
            type: `overall ${entity} analysis`,
            groupBy,
            metrics: allMetrics,
            data: results
        };
    }

    formatValue(metric, value) {
        if (metric.includes('mission')) {
            return `${value.toLocaleString()} tCO2e`;
        } else if (metric.includes('investment') || metric.includes('fundSize') || metric.includes('capital')) {
            return `$${value.toLocaleString()}M`;
        } else {
            return value.toLocaleString();
        }
    }
}

export default AnalyticsProcessor;