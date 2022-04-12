import {EventEmitter} from "@angular/core";

export class EmitterService {
  static authEmitter = new EventEmitter<boolean>();
  constructor() { }
}
