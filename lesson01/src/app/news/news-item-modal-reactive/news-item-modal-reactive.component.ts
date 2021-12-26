import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {NewsItemModel} from "../news-types";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-news-item-modal-reactive',
  templateUrl: './news-item-modal-reactive.component.html',
  styleUrls: ['./news-item-modal-reactive.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsItemModalReactiveComponent implements OnInit, OnDestroy {

  editedItem!: NewsItemModel;
  isVisible: boolean = false;
  newsItemFormGroup! : FormGroup;

  @Output() save : EventEmitter<NewsItemModel> = new EventEmitter<NewsItemModel>();

  get dateField() : FormControl {
    return this.newsItemFormGroup.get('dateField') as FormControl;
  }
  get headField() : FormControl {
    return this.newsItemFormGroup.get('headField') as FormControl;
  }
  get descField() : FormControl {
    return this.newsItemFormGroup.get('descField') as FormControl;
  }
  get tagsField() : FormControl {
    return this.newsItemFormGroup.get('tagsField') as FormControl;
  }


  constructor(private _cd : ChangeDetectorRef,
              private _route: ActivatedRoute,
              private _router: Router) {}

  ngOnInit(): void {
    this.newsItemFormGroup = new FormGroup({
      dateField : new FormControl('', [Validators.required, dateNotFutureValidator]),
      headField : new FormControl('', [Validators.required]),
      descField : new FormControl('', [Validators.required]),
      tagsField : new FormControl('', [Validators.required])
    });

    this.newsItemFormGroup.valueChanges
      .subscribe(
        (value => {
          this.editedItem.date = new Date(value.dateField);
          this.editedItem.head = value.headField;
          this.editedItem.desc = value.descField;
          this.editedItem.tag = value.tagsField;
        })
      )
  }

  show(item?: NewsItemModel) {
    if(item != undefined){
      this.editedItem = new NewsItemModel(item.id, item.date, item.head, item.desc, item.tag);
      this.editedItem.selected = item.selected;
    } else {
      this.editedItem = new NewsItemModel(-1, new Date(), "" , "", "");
    }

    this.newsItemFormGroup.setValue({
      headField : this.editedItem.head,
      dateField : this.editedItem.dateLocal,
      descField : this.editedItem.desc,
      tagsField : this.editedItem.tag
    }, {emitEvent: false})

    this.isVisible = true;
    this._cd.markForCheck();
  }

  cancel() {
    this.newsItemFormGroup.reset();
    this._router.navigate([{}], { relativeTo: this._route}).then(_ => {});
    this.isVisible = false;
  }

  saveItem() {
    this._router.navigate([{}], { relativeTo: this._route}).then(_ => {});
    this.isVisible = false;
    this.save.emit(this.editedItem);
  }

  ngOnDestroy() {
  }
}

function dateNotFutureValidator(formControl: FormControl) : null | { mess: string } {
  if(new Date(formControl.value) > new Date()){
    return { mess: "Дата не может быть в будущем"}
  }
  return null;
}
