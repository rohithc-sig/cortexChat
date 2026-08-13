/// <reference path="./typings.d.ts" />


"use strict";

import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { App } from "./App";

export class Visual implements IVisual {
    private targetElement: HTMLElement;
    private app: App;

    constructor(options: VisualConstructorOptions) {
        this.targetElement = options.element;
        // Initialize the UI handler inside the visual container
        this.app = new App(this.targetElement);
    }

    public update(options: VisualUpdateOptions) {
        const dataView = options.dataViews && options.dataViews[0];
        const contextPayload: { categories: Array<{ columnName: string; values: any[] }> } = { categories: [] };

        // 1. Extract active categories and slicer states from DataView
        if (dataView && dataView.categorical && dataView.categorical.categories) {
            const categories = dataView.categorical.categories;

            contextPayload.categories = categories.map(cat => {
                const colName = cat.source.displayName || "Unknown Column";
                // Get distinct active values passed by Power BI filters/slicers
                const distinctValues = Array.from(new Set(cat.values));

                return {
                    columnName: colName,
                    values: distinctValues
                };
            });
        }

        // 2. Pass updated context to App UI
        this.app.setContext(contextPayload);
    }
}