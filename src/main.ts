import { enableProfiling } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { appConfig } from './app/app.config';

enableProfiling();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
