import { Routes } from '@angular/router';
import {GameComponent} from "./game/game.component";

export const routes: Routes = [
  {path: 'play', component: GameComponent},
  {path: '**', redirectTo: 'play', pathMatch: 'full'},
];
