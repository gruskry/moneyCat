import { DbModel } from './../../models/currency.model';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ExpenseService } from 'src/app/services/expense.service';

@Component({
  selector: 'app-total-dialog',
  templateUrl: './total-dialog.component.html',
  styleUrls: ['./total-dialog.component.scss']
})
export class TotalDialogComponent implements OnInit {
  fullData: DbModel[] = []
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  constructor(
    private expenseService: ExpenseService,) { }

  ngOnInit(): void {
    this.expenseService.getFullOptions().then(data => {
    })
  }

}
