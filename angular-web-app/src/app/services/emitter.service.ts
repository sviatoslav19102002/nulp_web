import {EventEmitter} from "@angular/core";

export class EmitterService {
  static authEmitter = new EventEmitter<boolean>();
  static walletEmitter = new EventEmitter<boolean>();
  static historyEmitter = new EventEmitter<boolean>();
  constructor() { }
}
