"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";

import "./../style/visual.less";
import "./../style/chat.less";

import { App } from "./App";
import { VisualFormattingSettingsModel } from "./settings";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualEventService = powerbi.extensibility.IVisualEventService;

export class Visual implements IVisual {

    private events: IVisualEventService;
    private target: HTMLElement;
    private app: App;

    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {

        console.log("Initializing Cortex Chat Visual");

        this.events = options.host.eventService;
        this.target = options.element;

        this.formattingSettingsService = new FormattingSettingsService();

        this.app = new App();

        this.target.innerHTML = this.app.render();
        this.app.initialize();

    }

    public update(options: VisualUpdateOptions): void {

        this.events.renderingStarted(options);

        try {

            console.log("Visual Updated");

            console.log(options);

            if (options.dataViews && options.dataViews.length > 0) {

                this.formattingSettings =
                    this.formattingSettingsService.populateFormattingSettingsModel(
                        VisualFormattingSettingsModel,
                        options.dataViews[0]
                    );

            }

            this.events.renderingFinished(options);

        } catch (error) {

            console.error(error);

            this.events.renderingFailed(options, String(error));

        }

    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {

        return this.formattingSettingsService.buildFormattingModel(
            this.formattingSettings
        );

    }

}